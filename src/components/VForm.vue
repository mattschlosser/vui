<template>
    <form ref="form" @submit.prevent='submit' novalidate :data-vv-scope="scope">
        <div>
            <slot :edit="edit"></slot>
        </div>
        <button v-if="submitBtn && !disabled" type='submit' class='btn btn-green pull-right'>Save</button>
    </form>
</template>
<script>
    /*global _:true*/
    export default {
        name : "VForm",
        created(){
            this.reset();
        },
        data() {
            return {
                edit : null
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
            }
        },
        methods : {
            submit : async function(){
                if (this.disabled) return;
                let result = await this.$validator.validate(this.scope + ".*");
                if (result) {
                    this.$emit("submit",this.edit,this.reset);
                }
            },
            async reset(){
                if (this.object){
                    this.edit = _.cloneDeep(this.object);
                } else {
                    this.edit = {};
                }
                await this.$nextTick();
                this.$emit("reset");
            }
        },
        computed : {
            scope(){
                return _.uniqueId("v-form");
            }
        }
    };
</script>