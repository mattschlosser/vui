<template>
 
    <v-pagination
        :items ="sorted"
        :item-per-page="ipg"
        class="container-fluid v-table"
        ref="pagination"
        @updated="updateStickPos"
    >
        <template slot-scope="{ page,index }">
            <div class="vt-buttons">
                <slot name="buttons"></slot>
            </div>

            <div class="vt-length">
                <label>
                    Show 
                    <select class="form-control form-control-sm" v-model="ipg">
                        <option v-for="option in itemPerPageOptions"  :key="option" :value="option">{{option}}</option>
                        <option value="-1">All</option>
                    </select> 
                    entries
                </label>
            </div>

            <div class="vt-filter">
                <label>
                    <input v-model.trim="keyWord" type="search" class="form-control form-control-sm" placeholder="Search">
                </label>
            </div>

            <div class="vt-table d-flex">
                <table>
                    <thead>
                        <tr>
                            <th 
                                v-for="(field,i) in vt_fields"
                                :key="field.name" 
                                :class="{
                                    sorting : field.sortable,
                                    ascending : field.sorting == 1,
                                    descending : field.sorting == -1,
                                    sticky : field.sticky
                                }" 
                                @click="sort(field)" 
                                :style="{
                                    width : field.width,
                                    minWidth : field.width,
                                    maxWidth : field.width
                                }"
                                draggable
                                @dragstart="dragstart($event,field)"
                                @dragend="dragend"
                                @dblclick="stick(field)"
                                :data-name="field.name"
                            >
                                <span 
                                    class="dropline" 
                                    @dragover="dragover($event,i*2)" 
                                    @dragleave="dragleave" 
                                    @drop="drop($event,field,0)"  
                                    :class="{'dragging-over' : draggingOver == i*2}"
                                ></span>
                                <slot v-if="field.headSlot" :name="`${field.name}-head`"></slot>
                                <span v-else>
                                    {{field.head}}
                                </span>
                                <span class="underline" v-if="field.sticky"></span>
                                <span 
                                    class="dropline"
                                    @dragover="dragover($event,i*2+1)"  
                                    @dragleave="dragleave" 
                                    @drop="drop($event,field,1)"
                                    :class="{'dragging-over' : draggingOver == i*2+1}"
                                ></span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row,idx) in page" :key="idx">
                            <td 
                                :key="field.name" 
                                :class="css(field,row)"  
                                v-for="field in vt_fields"
                                :data-name="field.name"    
                            >
                                <slot v-if="field.slot" :name="field.name" :row="row"></slot>
                                <span v-else-if="field.html" v-html="field.html(row,field.name)"></span>
                                <span v-else-if="display(field, row) != null">
                                    {{ display(field, row) }}
                                </span>
                                <span v-else class="text-muted">
                                    None
                                </span> 
                            </td>
                        </tr>
                        <tr v-if="page.length == 0">
                            <td :colspan="vt_fields.length" class="text-center">No matching records found</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="vt-info" role="status" aria-live="polite">
                {{info(index)}}
            </div>
        </template>
    </v-pagination>
</template>

<script>
import VPagination from "./VPagination.vue"

/*global _:true*/
/*global $:true*/
/*eslint no-undef: "error"*/
export default {
    name: 'VTable',
    components : {
        VPagination
    },
    props: {
        rows : {
            type : [Array , Object],
            required : true
        },
        cols : {
            type : Array,
            required : true
        }
        /* 
            col : String or
            {
                name : String,                      // required, field name
                head : String,                      // optional, string for head 
                headSlot : Boolean,                 // optional, if use slot for head
                slot : Boolean,                     // optional, if use slot for content
                display : function(row,field_name) => String,  // optional content for display
                html : function(row,field_name) => HTML, // optional html content for display
                value :                             // optional, value for search and sort
                    function(row,field_name) => Any  or
                    {
                        search : function(row,field_name) => Any,
                        sort : function(row,field_name) => Any
                    } 
                width : String, // optional, width for th,
                css : String or function(row,field_name) => String, // optional, css classes apply to td
                exportable : Boolean // default to be true,
                sortable : Boolean // default to be true
            }
        */,
        itemPerPageOptions : {
            type : Array,
            default : ()=>[10,20,40,80]
        }
        
    },

    data(){
        return {
            ipg : this.itemPerPageOptions[0],
            keyWord : "",
            dragging : null,
            draggingOver : null,
            sorting : null
        };
    },
    methods : {
        async updateStickPos(){
            await this.$nextTick();
            let pos = 0;
            _.each(this.vt_fields,field=>{
                if (field.sticky){
                    $(this.$el).find(`[data-name='${field.name}']`).css("left",`${pos}px`);
                    pos += $(this.$el).find(`th[data-name=${field.name}]`).outerWidth();
                } else {
                    $(this.$el).find(`[data-name='${field.name}']`).css("left","");
                }
            });
        },
        dragstart(e,field){
            e.dataTransfer.setData("text/plain",field.name);
            this.dragging = field;
        },
        dragend(){
            this.dragging = null;
            this.draggingOver =null;
        },
        dragover(e,index){
            if (this.dragging){
                e.preventDefault();
                this.draggingOver = index;
            }
        },
        dragleave(){
            this.draggingOver =null;
        },
        drop(e,field,offset){
            if ( !this.dragging || (field == this.dragging)){
                return;
            }
            e.preventDefault();
            let index = _.indexOf(this.vt_fields,this.dragging);
            this.vt_fields.splice(index,1);
            index = _.indexOf(this.vt_fields,field) + offset;
            this.vt_fields.splice(index,0,this.dragging);
            if (field.sticky){
                this.$set(this.dragging,"sticky",true);
            }
            this.updateStickPos();
        },
        stick(field){
            if (!field.sticky){
                this.$set(field,"sticky",true);
            } else {
                this.$delete(field,"sticky");
            }
            this.updateStickPos();
        },
        sort(field){
            if (!field.sortable){
                return;
            }
            if (this.sorting != field){
                if (this.sorting){
                    this.$delete(this.sorting,'sorting');
                }
                this.$set(field,'sorting',1);
                this.sorting = field;
            } else {
                field.sorting = -field.sorting;
            }
        },
        value(field,row,type){
            if (_.isObject(field.value) && field.value[type]){
                return field.value[type](row,field.name);
            } 
            if (_.isFunction(field.value)){
                return field.value(row,field.name);
            } 
            return this.display(field,row);
        },
        display(field, row){
            return field.display ? field.display(row,field.name) : row[field.name];
        },
        info(index){
            let total = _.size(this.rows);
            let filtered = _.size(this.filtered);
            let start = _.min([index * this.ipg + 1,filtered]);
            let end = _.min([start + this.ipg - 1,filtered]);
            let info =  `Showing ${start} to ${end} of ${filtered}`;
            if ( total != filtered){
                info += ` (filtered from ${total} total entries)`;
            }
            return info;
        },
        css(field,row){
            let css = "";
            if (field.css){
                if (_.isFunction(field.css)){
                    css = field.css(row,field.name);
                } else {
                    css = field.css;
                }
            }
            if (!_.isObject(css)){
                css = {  
                    [css] : true
                };
            }
            css.sticky = field.sticky;
            return css;
        },
        serialize(){
            let cols = _.filter(this.vt_fields,field=>field.exportable);
            let rows = _.map(this.rows,row=>{
                let output = [];
                _.each(cols,field=>{
                    output.push(this.display(field, row));
                });
                return output;
            });
            cols = _.map(cols,field=>field.head);
            return {cols,rows};
        }
    },

    
    computed : {
        filtered(){
            if (!_.size(this.keyWord)){
                return _.toArray(this.rows);
            }
            return  _.filter(this.rows,(row)=>{
                let kw = _.toLower(this.keyWord);
                let found = false;
                _.each(this.vt_fields,(field)=>{
                    if (_.includes(_.toLower(this.value(field, row, "search")),kw)){
                        found = true;
                        return false;
                    }
                });
                return found;
            });
        },
        sorted(){
            if (!this.sorting){
                return this.filtered;
            }
            let field = this.sorting;
            let rows = _.clone(this.filtered);
            let compareFunc =  ((a,b)=>{
                a = this.value(field, a, "sort") || "";
                b = this.value(field, b, "sort") || "";
                if (a < b){
                    return -1;
                } else if(a > b){
                    return 1;
                } else {
                    return 0;
                }
            });
            rows.sort((a,b)=>field.sorting == 1 ? compareFunc(a,b) : compareFunc(b,a));
            return rows;
        },
        vt_fields(){
            return _.map(this.cols,col=>{
                let field;
                if (_.isString(col)){
                    field = {
                        name : col
                    };
                } else {
                    field = col;
                }
                _.defaults(field,{
                    head : _.startCase(field.name),
                    exportable : true,
                    sortable : true
                });
                return field;
            });
        }
    }
}
</script>

<style lang="less">
    div.v-table {
        div.vt-length {
            select {
                width: 75px;
                display: inline-block;  
                margin: 0 5px;
            }
        }

        div.vt-filter {
            text-align: right;
            input {
                margin-left: 0.5em;
                display: inline-block;
                width: auto;
            }
        }

        div.vt-info {
            padding-top: 0.85em;
            white-space: nowrap;
        }

        div.vt-buttons, div.vt-length, div.vt-info {
            float: left;
            margin-right: 15px;
            label {
                font-weight: normal;
                text-align: left;
                white-space: nowrap;
                display: inline;
            }
        }

        div.v-pagination {
            margin: 0;
            white-space: nowrap;
            text-align: right;
            ul.pagination {
                margin: 5px 0;
                display: inline-block;
                white-space: nowrap;
                justify-content: flex-end;

                &>li{
                    display: inline;
                }
            }
        }

        div.vt-table {
            overflow: auto;
            table {
                clear : both;
                margin : 10px 0!important;
                border-collapse: collapse!important;
                width : 100%;
                thead{
                    &>tr>th{
                        color: #242a30;
                        background-color: #fff;
                        font-weight: 600;
                        border-bottom: 1px solid #b6c2c9;
                        box-sizing: content-box;
                        vertical-align: bottom;
                        white-space: nowrap;
                        -webkit-touch-callout: none; 
                        -webkit-user-select: none; 
                        -khtml-user-select: none; 
                        -moz-user-select: none; 
                        -ms-user-select: none; 
                        user-select: none;
                        cursor: pointer;
                        position: relative;

                        &.sorting {
                            padding-right: 30px;
                            
                            &.ascending::after {
                                content: '\f0dd'!important;
                                opacity: 1!important;
                            }

                            &.descending::after {
                                content: '\f0de'!important;
                                opacity: 1!important;
                            }

                            &::after{
                                content: '\f0dc';
                                position: absolute;
                                bottom: 0.9em;
                                display: block;
                                opacity: 0.3;
                                right: 0.5em;
                                font-family: Font Awesome\ 5 Free,Font Awesome\ 5 Pro,FontAwesome!important;
                                font-weight: 900;
                                font-style: normal;
                                font-variant: normal;
                                text-rendering: auto;
                            }
                        }      
                        
                        .dropline {
                            position: absolute;
                            height : 100%;
                            width : 25%;
                            top : 0px;
                            &:first-child{
                                left : 0px;    
                                &.dragging-over{
                                    border-left: 2px dashed #348fe2;
                                }
                            }
                            &:last-child{
                                right : 0px;
                                &.dragging-over{
                                    border-right: 2px dashed #348fe2;
                                }
                            }
                            
                        }

                        &.sticky>.underline {
                            position : absolute;
                            bottom : -1px;
                            width : 100%;
                            height : 5px;
                            left : 0px;
                            background: #348fe2;
                        }
                    }
                }

                thead>tr>th,tbody>tr>td{
                    border-color: #e2e7eb;
                    padding: 10px 15px;
                    &.sticky {
                        position : sticky;
                        left : 0px;
                        z-index : 2;
                    }
                }
                tbody>tr>td{
                    -webkit-box-sizing: content-box;
                    box-sizing: content-box;
                    vertical-align: top;
                    border-top: 1px solid #dee2e6;
                    background-color: #fff;

                    .text-muted{
                        color: #b6c2c9!important;
                    }
                }

                tbody>tr:hover>td{
                    background: #e2e7ec!important;
                }
            }

        }        
    }
</style>