<style lang="less">
    .v-input {
        margin-bottom: 1rem;
    
        .select2.select2-container{
            max-width : 100%;
        }
        .vc-chrome {
            position: absolute;
            left: 0;
            top : 41px;
            z-index: 2029;
        }
        .vc-chrome.color-picker-up {
            bottom : 41px;
            top : unset;
        }
        &.checkbox.checkbox-css label::before {
            background: #aab4bf;
        }
        .color-picker {
            display: inline-block;
            position: relative;
            line-height: normal;
            height: 40px;

            .color-picker-trigger {
                display: inline-block;
                box-sizing: border-box;
                height: 40px;
                width: 40px;
                padding: 4px;
                border: 1px solid #e6e6e6;
                border-radius: 4px;
                font-size: 0;
                position: relative;
                cursor: pointer;
                
                .color-picker-color{
                    position: relative;
                    display: block;
                    box-sizing: border-box;
                    border: 1px solid #999;
                    border-radius: 2px;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    &.is-alpha{
                        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==)
                    }
                }
            }
            &.disabled .color-picker-trigger {
                cursor: unset;
            }
        }

        
        .color-picker-inner {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
        }
        .color-picker-icon {
            display: inline-block;
            width: 100%;
            text-align: center;
            font-size : 12px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%,-50%,0);
        }
        .vue-tags-input {
            max-width: unset;
            width: 100%;
            font-weight: 400;

            &>.ti-input { 
                padding: 6px 12px;
                border-radius: .25rem;
                transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
                border: 1px solid #d3d8de;
                box-shadow: none;
            }

            &.ti-disabled>.ti-input{
                background: #e5e9ed;
                opacity: .6;
                .ti-actions i{
                    cursor : unset;
                }
            }

            &.ti-focus>.ti-input{
                border-color: #5db0ff;
                outline: 0;
                box-shadow: 0 0 0 0.125rem rgba(52,142,227,.3);
            }

            input,.ti-tag{
                font-size: 12px!important;
                line-height: 1.42857143!important;
            }
        }

        .select2  {
            .select2-selection__clear{
                font-size: 1.4em!important;
            }

            .select2-selection--multiple .select2-selection__rendered li.select2-selection__choice{
                background-color: #348fe2;
                color: #fff;
                border-radius: 2px;
                font-size: 12px!important;
                line-height: 1.42857143 !important;
                padding : 3px 5px !important;
                &>span.select2-selection__choice__remove{
                    font-size: 1.4em;
                    line-height: 1;
                    color : #fff;
                    float : right;
                    margin-left : 0.2em;
                }
            }
        }

        .v-input-date-picker {
            input:not([disabled]){
                opacity : 1;
                background : #fff !important;
                &:focus{
                    border-color: #5db0ff;
                    box-shadow: 0 0 0 0.125rem rgba(52,142,227,.3);
                }
            }
        }

        .input-group {
            &>*{
                border-radius : 0px!important;
                &:not(.invalid-feedback) {
                    &:first-child {
                        border-top-left-radius: .25rem !important;
                        border-bottom-left-radius: .25rem !important;
                    }
                    &:nth-last-child(2){
                        border-top-right-radius: .25rem !important;
                        border-bottom-right-radius: .25rem !important;
                    }
                    &>*{
                        border-radius: inherit!important;
                        border-top-left-radius:inherit!important;
                        border-bottom-left-radius:inherit!important;
                        border-top-right-radius: inherit!important;
                        border-bottom-right-radius: inherit!important;
                    }
                }
            }
        }

        &.invalid {
            .select2-selection{
                border-color: #dc3545!important;
            }

            .form-control{
                border-color: #dc3545;
                &:focus {
                    border-color: #dc3545;
                    box-shadow: 0 0 0 0.2rem rgba(220,53,69,.25);  
                }
            }

            .invalid-feedback{
                display: block;
            }
        }

        &.small {
            .vc-chrome {
                top : 31px;
                &.color-picker-up {
                    bottom : 31px;
                }
            }
            .color-picker{
                height: 30px;
            }
            .color-picker-trigger {
                width : 30px;
                height : 30px;
            }
        }

    }
</style>
<script>
    /*global _:true*/
    /*global $:true*/
    /*global Vue:true*/
    /*global moment:true*/

    // validators 
    import Chrome from "vue-color/src/components/Chrome.vue";
    import VueTagsInput from "@johmun/vue-tags-input";

    // all type of input
    const components = {};

    const base_template =  (t,r="") => `
    <div class="v-input" :class="{'form-group':label, row : inline, 'invalid' : error}">
        <div v-if="label" :class="inline ? 'col-3 d-flex align-items-center' : ''">
            <label :class="inline ? 'mb-0' : ''">{{labelContent}}</label>
        </div>
        <div ref="inputGroup" :class="inputGroupClass">
            ${t}
            <div class="invalid-feedback">{{error}}</div>
        </div>
        ${r}
    </div>`;

    // general directives
    const directives = ` v-model="edit" :class="formControlClass" v-validate="validate" v-bind="attrs"`;

     // general template
    const simple_template = (t) => base_template(`
        <div v-if="prepend || $scopedSlots.prepend" class="input-group-prepend">
            <slot name="prepend">
                <span class="input-group-text">{{prepend}}</span>
            </slot>
        </div>
        ${t}
        <div v-if="append || $scopedSlots.append" class="input-group-append">
            <slot name="append">
                <span class="input-group-text">{{append}}</span>
            </slot>
        </div>
    `);
    
    // base
    const base = {
        name : "VInput",
        data(){
            return {
                editVal : null,
                attrs : {}
            }
        },
        beforeCreate(){
            this.id = _.uniqueId(this.$attrs.type);
            if (this.$parent.$options.name == "VForm"){
                this.$form = this.$parent;
            }
        },
        created(){
            if (this.$form){
                this.$form.$on("reset",this.reset); 
                this.$form.$on("disable",this.disable);
            }
            if (!this.$form || this.$form.doneCreated){
                this.reset();
            }
        },
        beforeDestroy(){
            if (this.$form){
                this.$form.$off("reset",this.reset);
                this.$form.$off("disable",this.disable);
            }
        },
        props : {
            value : null,
            label: String,
            large : Boolean,
            inline : Boolean,
            validate : {
                type : String,
                default : ""
            },
            default : null
        },
        methods : {
            editDefault : () => "",
            checkValue : (val) => val != null,
            reset(){
                this.$validator.reset();
                this.input(this.editVal,false);
                this.onReset();
            },
            onReset(){

            },
            input(val,change=true){
                this.$emit("input",val);
                if (change){
                    if (this.$form){
                        this.$form.dirty = true;
                    }
                    this.$emit("change",val);
                }
            },
            disable(val){
                this.attrs.disabled = this.$attrs.disabled || this.$attrs.disabled === "" || val
            },
            modifyAttrs(){

            }
        },
        computed : {
            labelContent(){
                return this.label + ":" + (this.attrs.required && !this.attrs.disabled ? " *": "");
            },
            scope(){
                if (this.$form){
                    return this.$form.scope;
                }
            },
            fullName(){
                return this.scope ? this.scope + "." + this.attrs.name : this.attrs.name;
            },
            error(){
                return this.errors.first(this.fullName);
            },
            inputGroupClass(){
                return {
                    'col-9' : this.inline && this.label,
                    'col-12' : this.inline && !this.label
                };
            },
            formControlClass(){
                return {
                    'form-control-lg' : this.large,
                    'form-control' : true
                };
            },
            edit : {
                get(){
                    return this.editVal;
                },
                set(val){
                    this.input(val);
                }
            }
        },
        watch : {
            value : {
                handler(val){
                    if (this.checkValue(val)){
                        this.editVal = val;
                    } else if (this.default != null){
                        this.editVal = this.default;
                    } else {
                        this.editVal = this.editDefault();
                    }
                },
                immediate : true
            },
            $attrs : {
                handler(val){
                    if (_.isEqual(this.__last_attrs,val)){
                        return;
                    }
                    this.__last_attrs = val;
                    let attrs = _.clone(val);
                    attrs.disabled = attrs.disabled || attrs.disabled === "" || (this.$form ? this.$form.disabled : false)
                    attrs.required = attrs.required || attrs.required === ""
                    attrs.autocomplete = attrs.autocomplete || "off";
                    let name ;
                    if (attrs.name){
                        name = attrs.name;
                    } else if(attrs.label){
                        name = attrs.label;
                    } else if(attrs.placeholder){
                        name = attrs.placeholder;
                    } else {
                        name = this.id;
                    }
                    attrs.name = _.snakeCase(name);
                    attrs["data-vv-as"] = attrs["data-vv-as"] ||  _.lowerCase(attrs.name);
                    this.modifyAttrs(attrs);
                    this.attrs = attrs;
                },
                immediate : true
            }
        }
    };

    function register(type,fn){
        components[type] = fn({components,base,base_template,simple_template,directives});
    }




    const VInput = {
        name : "VInput",
        props : {
            type : {
                type : String,
                default : "search"
            }    
        },
        functional : true,
        render : (h,context)=>{
            let attrs = context.data.attrs || {};
            attrs.type = context.props.type == 'text' ? 'search' : context.props.type;
            attrs = _.merge({},attrs,{
                showPlaceholder : attrs.placeholder != null || (attrs.required ? true : false) || attrs.required === "",
                placeholder : attrs.placeholder ? attrs.placeholder : attrs.label
            });
            context.data.attrs = attrs;
            return h(_.get(components,attrs.type,components.simple),context.data,context.children);
        },
        register
    };

    // text area
    VInput.register("textarea",({base, base_template, directives})=>({
        extends : base,
        template : base_template(`<textarea ${directives}></textarea>`)
    }));

    // check box
    components.checkbox = {
        extends : base,
        methods : {
            editDefault : () => 0,
        },
        computed: {
            edit : {
                get(){
                    return this.editVal;
                },
                set(val){
                    this.input(val ? 1 : 0);
                }
            },
        },
        template : `
        <div class="checkbox checkbox-css v-input" :class = "{'checkbox-inline' : inline, disabled : attrs.disabled}">
            <input  :id="id" type="checkbox" ${directives}/>
            <label :for="id" class="noselect" :class="{'cursor-pointer': !attrs.disabled}">{{label}}<slot></slot></label>
        </div>
        `
    };

    // simple input
    components.simple = {
        props : {
            prepend : String,
            append : String
        },
        extends : base,
        computed : {
            inputGroupClass(){
                let cls = base.computed.inputGroupClass.apply(this);
                cls["input-group"] = cls["input-group"] || this.prepend || this.append || this.$scopedSlots.prepend || this.$scopedSlots.append;
                return cls;
            }
        },
        template : simple_template(`<input ref="input" ${directives}></input>`)
    };

    // select 
    components.select = {
        props : {
            options : Array,
            showPlaceholder : Boolean
        },
        methods : {
            editDefault(){
                return this.$attrs.multiple != null ? new Array() : "";
            },
            checkValue(val){
                return this.$attrs.multiple != null ? _.isArray(val) : (val != null && !_.isObject(val));
            }
        },
        extends : components.simple,
        template : simple_template(`
        <select ${directives}>
            <option v-if="showPlaceholder" value="" disabled>--- {{attrs.placeholder}} ---</option>
            <slot>
                <option v-for="{value,label} in options" :value="value">{{label}}</option>
            </slot>
        </select>
        `)
    };

    // select2
    components.select2 = {
        extends : components.select,
        props : {
            template : Function,
            templateResult : Function,
            templateSelection : Function,
            config: Object
        },
        mounted(){
            let config = {
                width : "100%",
                allowClear : this.attrs.multiple == null,
                ...this.config
            };
            if (this.showPlaceholder){
                config.placeholder = `--- ${this.attrs.placeholder} ---`;
            }

            let modal = $(this.$el).closest(".modal");
            if (modal.length){
                config.dropdownParent = modal.find(".modal-content"); 
            } 

            if (this.template){
                config.templateResult = this.template;
                config.templateSelection = this.template;
            } 
            if (this.templateResult){
                config.templateResult = this.templateResult;
            }
            if (this.templateSelection){
                config.templateSelection = this.templateSelection;
            }


            this.initSelect2 = ()=>{
                if (this.cleanup) return;
                if(this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                    $(this.$refs.select).off().select2("destroy");
                }
                $(this.$refs.select).select2(config)
                .on("select2:select",e=>{
                    if (this.attrs.multiple != null){
                        this.edit = _.concat(this.edit,e.params.data.id);
                    } else {
                        this.edit = e.params.data.id;
                    }
                })
                .on("select2:unselect",e=>{
                    if (this.attrs.multiple != null){
                        this.edit = _.without(this.edit,e.params.data.id);
                    } else {
                        this.edit = "";
                    }
                });
                if (this.options || _.get(this.config,"ajax")){
                    this.observer = new MutationObserver(()=>{
                        this.initSelect2()
                    });
                    this.observer.observe(
                        this.$refs.select,
                        {  childList: true,  subtree: true }
                    );
                }
            }
            this.initSelect2();
        },
        beforeDestroy(){
            this.cleanup = true;
            $(this.$refs.select).off().select2("destroy");
            if (this.observer){
                this.observer.disconnect();
                this.observer = null;
            }

        },
        watch: {
            edit(value) {
                $(this.$refs.select)
                .val(value)
                .trigger('change')
            }
        },
        template : simple_template(`
        <select  ${directives} ref="select">
            <slot>
                <option v-for="{value,label} in options" :value="value">{{label}}</option>
            </slot>
        </select>
        `)
    };

    components.date = {
        extends : base,
        props : {
            type : String,
            option : Object,
            format : {
                type : String,
                default : "YYYY-MM-DD"
            }
        },
        watch: {
            edit(value) {
                $(this.$refs.inputGroup).datepicker("update",value);
            }
        },
        mounted(){
            $(this.$refs.inputGroup).datepicker(_.merge({ 
                todayHighlight: true, 
                format: {
                    toDisplay: date=>{
                        return moment(date).format(this.format);
                    },
                    toValue: date=>{
                        return moment(date).toDate();
                    }
                }, 
                autoclose: true,
                clearBtn : !this.attrs.required,
                zIndexOffset : 1023
            },this.option)).on("hide",e=>{
                if (e.date){
                    this.edit = moment(e.date).format("YYYY-MM-DD");
                } else {
                    this.edit = "";
                }
            });
            $(this.$refs.inputGroup).datepicker("update",this.edit);
        },
        beforeDestroy(){
            $(this.$refs.inputGroup).off().datepicker("destroy");
        },
        computed : {
            inputGroupClass(){
                let cls = base.computed.inputGroupClass.apply(this);
                cls["input-group date v-input-date-picker"] = true;
                return cls;
            }
        },
        template : base_template(`
            <input v-bind="attrs" :class="formControlClass" readonly>
            <div  class="input-group-addon">
                <i class="far fa-calendar-alt cursor-pointer"></i>
            </div>
        `,`<input v-model="edit" v-bind="attrs" v-validate="validate" class="d-none">`)
    };

    components["time-range"] = {
        extends : base,
        props : {
            default : {
                type : Array,
                default :()=>["",""]
            }    
        },
        computed : {
            inputGroupClass(){
                let cls = base.computed.inputGroupClass.apply(this);
                cls["input-group"] = true;
                return cls;
            }
        },
        methods : {
            editDefault(){return this.default},
            checkValue : (val)=>_.isArray(val)
        },

        template : base_template(`
            <input class="text-center" ref="startdate" type="time" :class="formControlClass" v-validate="validate" placeholder="Start Time" :value="edit[0]" @input="e=>edit=[e.srcElement.value,edit[1]]" :disabled="attrs.disabled" :name="attrs.name" :required="attrs.required" data-vv-as="start time">
            <div class="input-group-addon rounded-0">to</div>
            <input class="text-center rounded-right" ref="enddate" type="time" :class="formControlClass" v-validate="validate" placeholder="End Time" :value="edit[1]" @input="e=>edit=[edit[0],e.srcElement.value]" :disabled="attrs.disabled" :name="attrs.name" :required="attrs.required" data-vv-as="end time">
        `)
    };

    const daterange = {
        extends : base,
        props : {
            default : {
                type : Array,
                default :()=>["",""]
            }    
        },
        methods : {
            editDefault(){return this.default},
            checkValue : (val)=>_.isArray(val)
        },
        watch: {
            async edit(val){
                $(this.$refs.startdate).datepicker("update",val[0]);
                $(this.$refs.enddate).datepicker("update",val[1]);
                $(this.$refs.inputGroup).datepicker('updateDates');
                await this.$nextTick();
                this.$validator.validate(this.fullName);
            }
        },
        mounted(){
            $(this.$refs.inputGroup).datepicker({ 
                format: 'yyyy-mm-dd',
                keepEmptyValues : true,
                autoclose: true,
                clearBtn : !this.attrs.required,
                zIndexOffset : 1023
            }).on("hide",()=>{
                let startdate = $(this.$refs.startdate).datepicker("getDate");
                let enddate =  $(this.$refs.enddate).datepicker("getDate");
                this.edit = [
                    startdate ? startdate.toISOString().slice(0,10) : startdate,
                    enddate ? enddate.toISOString().slice(0,10) : enddate
                ];
            });  
        },
        beforeDestroy(){
            $(this.$refs.startdate).datepicker("destroy");
            $(this.$refs.enddate).datepicker("destroy");
        },
        computed : {
            inputGroupClass(){
                let cls = base.computed.inputGroupClass.apply(this);
                cls["input-group input-daterange v-input-date-picker"] = true;
                return cls;
            },
        },
        template : base_template(`
            <input ref="startdate" type="text" :class="formControlClass" placeholder="Start Date" readonly :value="edit[0]" :disabled="attrs.disabled">
            <div class="input-group-addon">to</div>
            <input ref="enddate" type="text" :class="formControlClass" class="rounded-right" placeholder="End Date" readonly :value="edit[1]" :disabled="attrs.disabled">
        `,`<input v-model="edit[0] ? edit[1] : edit[0]"  v-validate="validate" :data-vv-as="edit[0] ? 'end date' : 'start date'" class="d-none" v-bind="attrs">`)
    };

    components["date-range"] = {
        functional : true,
        props : {
            "selectable" : Boolean 
        },
        render(nd,context){
            let value = _.get(context,"data.attrs.value");
            if (_.get(context,"props.selectable") && !((_.isArray(value) && (value[0] || value[1])) || value == "?" )){
                let options = {
                    "0m,1m" : "Current month",
                    "-1m,0m" : "Last month",
                    "1m,2m" : "Next month",
                    "-30d,0d" : "Last 30 days",
                    "0d,30d" : "Next 30 days",
                    "-1y,0y" : "Last year",
                    "0y,1y" : "This year",
                    "?" : "Custom date range"
                };
                _.set(context,"data.attrs.default","0m,1m");
                let children = _.map(options,(text,value)=>nd("option",{attrs : {value }},text));
                return nd(components.select,context.data,children);
            }
            if (_.get(context,"props.selectable")){
                _.set(context,"data.attrs.default",Vue.prototype.$parseDaterange("0m,1m"));
            }
            return nd(daterange,context.data);
        }
    };

    components["password-confirm"] = {
        extends : base,
        props : {
            type : String
        },
        template : base_template(`
            <div class="row">
                <div class="col">
                    <input 
                        v-model="edit" 
                        :class="formControlClass" 
                        v-validate 
                        ref="password" 
                        type="password" 
                        placeholder="Password"
                        v-validate="'required|hasLower|hasNumber|hasUpper|min:8|confirmed:confirmation'"
                        v-bind="attrs" 
                    >
                </div>
                <div class="col">
                    <input
                        type = "password"
                        placeholder = "Re-enter Password"
                        :class="formControlClass" 
                        ref="confirmation"
                        :disabled="attrs.disabled"
                    >
                </div>
            </div>
        `)
    };

    components.tags = {
        extends : base,
        data(){
            return {
                tag : ""
            }
        },
        methods : {
            editDefault : ()=>[],
            checkValue : (val)=>_.isArray(val),
            onReset(){this.tag = ""}
        },
        computed : {
            edit : {
                get(){
                    return _.map(this.editVal,tag=>({text : tag,classes : "bg-primary"}));
                },
                set(val){
                    this.input(val);
                }
            }
        },
        components : {
            VueTagsInput
        },
        template : base_template(`
            <vue-tags-input
                v-model ="tag"
                :tags="edit"
                @tags-changed="tags=>edit=_.map(tags,tag=>tag.text)"
                v-bind="attrs"
                allow-edit-tags
            />`
        )
    };

    components.color = {
        extends : base,
        props : {
            type : String,
            up : Boolean
        },
        data(){
            return {
                displayPicker : false
            }
        },
        computed : {
            inputGroupClass(){
                let cls = base.computed.inputGroupClass.apply(this);
                cls["input-group"] = true;
                return cls;
            },
            edit : {
                get(){
                    return this.editVal.hex || this.editVal;
                },
                set(val){
                    if (!_.isString(val)){
                        val = val.hex8;
                    }
                    this.input(val);
                }
            },
            iconClass(){
                return `text-${this.$invertColor(this.edit)} fa-angle-${this.displayPicker ^ this.up ? 'up' : 'down'}`;
            }
        },
        components : {
            'chrome-picker': Chrome
        },
        methods : {
            togglePicker() {
                if (this.attrs.disabled) return;
                this.displayPicker ? this.hidePicker() : this.showPicker();
            },
            showPicker() {
                document.addEventListener('mousedown', this.documentClick);
                this.displayPicker = true;
            },
            hidePicker() {
                document.removeEventListener('mousedown', this.documentClick);
                this.displayPicker = false;
            },
            documentClick(e) {
                var el = this.$refs.inputGroup,
                    target = e.target;
                if(el !== target && !el.contains(target)) {
                    this.hidePicker()
                }
            }
        },
        template : base_template(`
            <div class="color-picker" :class="{disabled : attrs.disabled}">
                <div class="color-picker-trigger" @click="togglePicker">
                    <span class="color-picker-color is-alpha">
                        <span 
                            class="color-picker-inner" 
                            :style="{'background-color' : edit}"
                        ></span>
                    </span>
                    <span class="color-picker-icon far" :class="iconClass"></span>
                </div>
                <transition 
                    enter-active-class="animated flipInX"
                    leave-active-class="animated flipOutX"
                >
                    <chrome-picker 
                        :class="{'color-picker-up' : up}"
                        v-model="edit"
                        v-if="displayPicker"
                    ></chrome-picker>
                </transition>
            </div>
        `)
    };
    export default VInput;
</script>