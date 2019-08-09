import VeeValidate from 'vee-validate';
/*global _:true*/
/*global $:true*/
/*global moment:true*/

export default {
    install(Vue) {
        window.appLoading.push(new Promise((resolve)=>{
            Vue.prototype.$appReady = resolve;
        }));
        window.appLoading.push(new Promise((resolve)=>{
            $(document).ready(resolve);
        }));
        let ready = Promise.all(window.appLoading);

        window.onAppReady = fn => ready.then(fn);
        window.onAppReady(()=>{
            window.App.init()});
        _.each(window.appReady,fn=>window.onAppReady(fn));

        /*
        ********************* 
        *       Utils       *
        * *******************
        */
        Vue.prototype.Color = (hex)=>{
            let r,g,b,a;
            r = g = b = 0;
            a = 1.0;
            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            // convert 3-digit hex to 6-digits.
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            if (hex.length >= 6){
                r = parseInt(hex.slice(0, 2), 16);
                g = parseInt(hex.slice(2, 4), 16);
                b = parseInt(hex.slice(4, 6), 16);
            }

            if (hex.length == 8){
                a = parseInt(hex.slice(6, 8), 16) / 255.0;
            }

            return {
                r,g,b,a,
                toString(){
                    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
                },
                get invert(){
                    return (this.r * 0.299 + this.g * 0.587 + this.b * 0.114) > 186 ? 'black' : 'white';
                }
            }
        };

        Vue.prototype.$invertColor = (hex)=>{
            return Vue.prototype.Color(hex).invert;
        };

        Vue.prototype.$timeFormat = (time,format="llll") =>  moment(time).format(format);

        Vue.prototype.$parseDaterange = (daterange) => {
            if (!_.isString(daterange)){
                return daterange;
            }
            return _.map(_.split(daterange,","),(s,index)=>{
                let m = moment();
                let number = Number.parseInt(s.slice(0,-1));
                let type = s.slice(-1);
                if (type == 'd'){
                    m.add(number,"d");
                } else if (type == 'm'){
                    m.date(1);
                    m.add(number,"M");
                } else if (type == 'y'){
                    m.dayOfYear(1);
                    m.add(number,"y");
                }
                if (index == 1 && type!="d"){
                    m.add(-1,"d");
                }
                return m.format().substr(0,10);
            });
        }
        

        // ajax
        Vue.prototype.$ajax=(url,method="post",data=null)=>new Promise((resolve,reject)=>{
            let config = {
                dataType: 'json',
                dataFilter(data){
                    if (!data.length){
                        return null;
                    }
                    return data;
                },
                success(output){
                    if(window.CheckLogin(output) ==  'no')
                    {
                        reject("Not Login");
                    } else {
                        resolve(output);
                    }
                    
                },
                error(xhr,textStatus,errorThrown){
                    if (!xhr.readyState){
                        reject("XHR Send Failed");
                        return;
                    }
                    switch(textStatus){
                        case "timeout":
                            window.Swal.fire("Request Timeout","","error");
                            break;
                        case "error":
                            window.Swal.fire("Internet Error",errorThrown,"error");
                            break;
                        default:
                            window.Swal.fire("Internet Error",textStatus,"error");
                    }
                    reject(textStatus);
                }
            };
            if (_.isObject(url)){
                _.assign(config,url);
            } else {
                _.assign(config,{
                    url,
                    method,
                    data
                });
            }
            $.ajax(config);
        });

        /*
        ***********************    
        *       Directive     *
        * *********************
        */
        Vue.directive('tooltip',{
            bind(el,binding){
                el.title = binding.value;
                $(el).tooltip();
            },
            unbind(el){
                $(el).tooltip("dispose");
            }
        });


        /*
        *********************    
        *       Plugins     *
        * *******************
        */
        Vue.use(VeeValidate);

        VeeValidate.Validator.extend("hasLower",{
            getMessage : field => 'The ' + field + ' should contain at least one lower letter',
            validate : value => value !== _.toUpper(value)
        });
        VeeValidate.Validator.extend("hasNumber",{
            getMessage : field => 'The ' + field + ' should contain at least one number',
            validate : value => value !== _.replace(value , new RegExp("[0-9]","g") ,"")
        });
        VeeValidate.Validator.extend("hasUpper",{
            getMessage : field => 'The ' + field + ' should contain at least one upper letter',
            validate : value => value !== _.toLower(value)
        });

        // store
        Vue.prototype.$store = Vue.observable({});

        // bus
        Vue.prototype.$bus = new Vue();

        // poll controller
        Vue.prototype.$poll = new Vue ({
            created(){
                this.tasks = new Map();
                window.onAppReady(()=>{
                    this.update();
                    this.interval = setInterval(this.update, 5000);
                });
                this.seq = 0;
                this.ack = -1;
                this.$bus.$on("login",this.startService);
                this.startService();
            },
            beforeDestroy(){
                this.$bus.$off("login",this.startService);
                clearInterval(this.interval);
            },
            methods : {
                register(task = null){
                    this.tasks.set(task.name,task);
                },
                remove(name){
                    this.tasks.delete(name);
                },
                startService(){
                    this.running = true;
                },
                async update(name=null){
                    let data = {};
                    let loading = [];
                    if (name) {
                        let task = this.tasks.get(name);
                        if (!task) return;
                        data[name] = task.get ? task.get() : null;
                    } else {
                        // No auto update if service stopped
                        if (!this.running){
                            return;
                        }

                        // Get all tasks
                        this.tasks.forEach((task,name) => {
                            if (!data[name]){
                                data[name] = {};
                            }
                            if (task){
                                if (task.get) _.assign(data[name],task.get());
                                if (task.init && !task.inited) loading.push(task);
                            }
                        });
                    }
                    if (!_.size(data)){
                        return;
                    }
                    try {
                        let seq = this.seq++;
                        let events = await this.$ajax(`/ajax/poll.php?seq=${seq}`,"post",data);

                        // drop outdate response
                        if (seq < this.ack) {
                            return;
                        }
                        this.ack = seq;

                        _.each(events,(event,name)=>{
                            let task = this.tasks.get(name);
                            if (task && task.set){
                                task.set(event);
                            }     
                        });
                        _.each(loading,(task)=>{
                            task.init();
                            task.inited = true;
                        });
                    } catch (e){  
                        this.running = false;
                    }
                }
            },
        });       
    }
};