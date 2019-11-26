<template>
    <form ref="form" @submit.prevent='submit' novalidate :data-vv-scope="scope">
        <div>
            <slot :edit="edit" :disabled="disabled"></slot>
        </div>
        <button v-if="submitBtn && !disabled" type='submit' class='btn btn-green pull-right'>Save</button>
    </form>
</template>
<script>
    /*global _:true*/
    const _list_v_forms = [];
    window.addEventListener("beforeunload",(ev)=>{
        for (let form of _list_v_forms){
            if (form.is_dirty()){
                ev.returnValue = "Changes you made may not be saved.";
                return;
            }
        }
    });
    export default {
        name : "VForm",
        created(){
            this.reset();
            _list_v_forms.push(this);
            this.doneCreated = true;
        },
        beforeDestroy(){
            _.pull(_list_v_forms,this);
        },
        data() {
            return {
                edit : null,
                dirty : false
            }
        },
        watch : {
            object : function(){
                this.reset();
            }
        },
        props : {
            object : {
                type: Object,
                default : function(){return {};}
            },
            submitBtn : {
                type: Boolean
            },
            disabled : {
                type: Boolean
            },
            validate : {
                type : Function
            },
            notifyUnsaved : {
                type : Boolean
            },
            validateMode : {
                type : String
            }
        },
        methods : {
            submit : async function(){
                if (this.disabled) return;
                if (!await this.validate_all()) return;
                this.dirty = false;
                this.$emit("submit",this.edit,this.reset);
            },
            async validate_all(selector="*"){
                let result = await this.$validator.validate(this.scope + "." + selector);
                this.$emit("failed-validation");
                if (!result) return false;
                if (this.validate && !(await this.validate(this.edit))) return false;
                return true;
            },
            async reset(){
                if (this.object){
                    this.edit = _.cloneDeep(this.object);
                } else {
                    this.edit = {};
                }
                await this.$nextTick();
                this.$emit("reset");
            },
            is_dirty(){
                if (this.notifyUnsaved && this.dirty){
                    return true;
                }
                return false;
            }
        },
        computed : {
            scope(){
                return _.uniqueId("v-form");
            }
        }
    };
</script>