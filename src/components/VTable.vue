<template>
 
    <v-pagination
        :items ="sorted"
        :item-per-page="ipg"
        class="container-fluid v-table"
        ref="pagination"
    >
        <template slot-scope="{ page,index }">
            <div class="vt-buttons">
                <slot name="buttons"></slot>
            </div>

            <div class="vt-length">
                <label>
                    Show 
                    <select class="form-control form-control-sm" v-model="ipg">
                        <option v-for="option in ipgOptions"  :key="option" :value="option">{{option}}</option>
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

            <div class="vt-table">
                <table>
                    <thead>
                        <tr>
                            <th 
                                v-for="(field,i) in cols" 
                                :key="i" 
                                class="sorting" 
                                :class="sortFieldIndex == i ? (sortAsc ? 'ascending' : 'descending') : ''" 
                                @click="sort(i)"
                                :style="field.width ? `width:${field.width}` : '' "    
                            >
                                <slot v-if="field.headSlot" :name="`${field.name}-head`"></slot>
                                <template v-else>
                                    {{ printHead(field) }}
                                </template>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in page" :key="row.id">
                            <td v-for="(field,i) in cols" :key="i" :class="css(field,row)">
                                <slot v-if="field.slot" :name="field.name" :row="row"></slot>
                                <span v-else-if="display(field, row)">
                                    {{ display(field, row) }}
                                </span>
                                <span v-else class="text-muted">
                                    None
                                </span>
                            </td>
                        </tr>
                        <tr v-if="page.length == 0">
                            <td :colspan="cols.length" class="text-center">No matching records found</td>
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
                value :                             // optional, value for search and sort
                    function(row,field_name) => Any  or
                    {
                        search : function(row,field_name) => Any,
                        sort : function(row,field_name) => Any
                    } 
                css : String or function(row,field_name) => String
            }
        */
    },

    data(){
        let ipgOptions = [10,20,40,80];
        return {
            ipgOptions,
            ipg : ipgOptions[0],
            keyWord : "",
            sortFieldIndex : 0,
            sortAsc : true
        };
    },

    methods : {
        printHead(field){
            return field.head || _.startCase(field.name || field);
        },
        sort(i){
            if ( this.sortFieldIndex == i){
                this.sortAsc = !this.sortAsc;
            } else {
                this.sortFieldIndex = i;
                this.sortAsc = true;
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
            return field.display ? field.display(row,field.name) : row[field.name || field];
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
            if (field.css){
                if (_.isFunction(field.css)){
                    return field.css(row,field.name);
                } 
                return field.css;
            }
            return "";
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
                _.each(this.cols,(field)=>{
                    if (_.includes(_.toLower(this.value(field, row, "search")),kw)){
                        found = true;
                        return false;
                    }
                });
                return found;
            });
        },

        sorted(){
            let field = this.cols[this.sortFieldIndex];
            let compareFunc = field.compare || ((a,b)=>{
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

            let rows = _.clone(this.filtered);
            rows.sort((a,b)=>this.sortAsc ? compareFunc(a,b) : compareFunc(b,a));
            return rows;
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
                        font-weight: 600;
                        border-bottom: 1px solid #b6c2c9!important;
                        box-sizing: content-box;
                        vertical-align: bottom;
                        white-space: nowrap;
                        -webkit-touch-callout: none; 
                        -webkit-user-select: none; 
                        -khtml-user-select: none; 
                        -moz-user-select: none; 
                        -ms-user-select: none; 
                        user-select: none;
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

                        &.sorting {
                            padding-right: 30px;
                            cursor: pointer;
                            position: relative;
                        }
                    }
                }

                thead>tr>th,tbody>tr>td{
                    border-color: #e2e7eb;
                    padding: 10px 15px;
                }
                tbody>tr>td{
                    -webkit-box-sizing: content-box;
                    box-sizing: content-box;
                    vertical-align: top;
                    border-top: 1px solid #dee2e6;

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