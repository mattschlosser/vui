<template>
    <div>
        <slot :page="page" :index="pageIndex"></slot>
        <div class="v-pagination">
            <ul class="pagination">
                <li class="page-item" :class="{disabled : pageIndex==0}">
                    <a href="javascript:;" tabindex="0" class="page-link"  @click="pageIndex -= 1">Previous</a>
                </li>
                <li class="page-item" v-for="(status,index) in pageStatus" :key="index" :class="{active : index == pageIndex,disabled : status=='disable'}" >
                    <a v-if="status=='active'" href="javascript:;" tabindex="0" class="page-link" @click="pageIndex = index">{{index + 1}}</a>
                    <a v-else-if="status=='disable'" href="javascript:;" tabindex="0" class="page-link">...</a>
                </li>
                <li class="page-item" :class="{disabled : pageIndex==pages.length - 1}" >
                    <a href="javascript:;" tabindex="0" class="page-link" @click="pageIndex += 1">Next</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
/*global _:true*/
export default {
    name: 'VPagination',
    data(){
        return {
            pageIndex : 0
        }
    },
    props : {
        "items" : {
            type : Array,
            required : true
        },
        "itemPerPage" : {
            type : Number,
            required : true
        }
    },

    computed : {
        pages(){
            if (this.items.length == 0){
                return [[]];
            }
            if (this.itemPerPage > 0){
                return _.chunk(this.items, this.itemPerPage)
            }
            return [this.items];
        },
        page(){
            // eslint-disable-next-line
            this.pageIndex = _.min([this.pages.length - 1, this.pageIndex]);
            this.$emit("updated");
            return this.pages[this.pageIndex];
        },
        pageStatus(){
            if (this.pages.length < 8){
                return _.fill(Array(this.pages.length),"active");
            }
            let last = this.pages.length - 1;
            let status = _.fill(Array(this.pages.length),false);
            if (this.pageIndex < 4){
                status[last] = "active";
                status[last - 1] = "disable";
                _.fill(status,"active",0,5);
            }
            else if (this.pageIndex > this.pages.length - 5){
                
                status[0] = "active";
                status[1] = "disable";
                _.fill(status,"active",this.pages.length - 5);
                
            }
            else {
                status[0] = "active";
                status[1] = "disable";
                status[last] = "active";
                status[last - 1] = "disable";     
                status[this.pageIndex - 1] = "active";
                status[this.pageIndex] = "active";
                status[this.pageIndex + 1] = "active";
            }
            return status;
        },
    },
}
</script>

<style>
    div.v-pagination>ul.pagination>li.page-item {
        -webkit-touch-callout: none; 
        -webkit-user-select: none; 
        -khtml-user-select: none; 
        -moz-user-select: none; 
        -ms-user-select: none; 
        user-select: none;
    }
</style>