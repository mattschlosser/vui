export default {
    name : "VInput",
    components : {ValidationProvider},
    data(){
        return {
            editVal : null
        }
    },
    // created(){
    //     if (this.$parent.$options.name == "VForm"){
    //         this.$form = this.$parent;
    //         this.$form.$on("reset",this.reset); 
    //     }
    //     if (!this.$form || this.$form.doneCreated){
    //         this.reset();
    //     }
    //     this.id = _.uniqueId(this.$attrs.type);
    // },
    // beforeDestroy(){
    //     if (this.$form){
    //         this.$form.$off("reset",this.reset);
    //     }
    // },
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
            // this.$validator.reset();
            // this.input(this.editVal,false);
            // this.onReset();
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
        }
    },
    computed : {
        attrs(){
            let attrs = _.clone(this.$attrs);
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
            return attrs;
        },
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
        }
    }
};
