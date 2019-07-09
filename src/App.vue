<template>
    <div id="app">
        <h1 id="input">Input</h1>
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn"></div> 
                <h4 class="panel-title">v-input</h4>
            </div> 
            <div class="panel-body">
                <v-form submit-btn ref="f">
                    <template #default = "{edit}">
                        <code>{{JSON.stringify(edit)}}</code>
                        <v-input label="text" required v-model="edit.text" inline @input='print("input")' @change='print("change")'></v-input>
                        <v-input label="textarea"  type="textarea" required v-model="edit.detail"></v-input>
                        
                        <v-input type="number" label="number" v-model.number="edit.limit" min="50" max="100" step="10" required large></v-input>

                        <v-input type="select" label="select" v-model="edit.select" required>
                            <option v-for="i in edit.limit" :value="i" :key="i">{{i}}</option>
                        </v-input>

                        <v-input type="select2" label="select2" v-model="edit.select2" required>
                            <option v-for="i in edit.limit" :value="i" :key="i">{{i}}</option>
                        </v-input>

                        <v-input type="select" label="select multiple" v-model="edit.selectmultiple" required multiple>
                            <option v-for="i in 3" :value="i" :key="i">Value {{i}}</option>
                        </v-input>

                        <v-input type="select2" label="select2 multiple" v-model="edit.select2multiple" required multiple>
                            <option v-for="i in 100" :value="i" :key="i">Value {{i}}</option>
                        </v-input>
                        <v-input type="date" label="date" v-model="edit.date" required></v-input>
                        <v-input type="date" label="month" v-model="edit.date" required :option="{minViewMode : 1}" format="MMM YYYY"></v-input>

                        <v-input type="date-range" label="DateRange" v-model="edit.daterange" required></v-input>
                        <v-input type="date-range" label="Selectable Date Range" v-model="edit.s_daterange" selectable></v-input>


                        <v-input type="password-confirm" label="password" v-model="edit.psw"></v-input>

                        <v-input type="color" label="color" v-model="edit.color" inline></v-input>

                        <v-input type="tags" label="tags" v-model="edit.tags"></v-input>

                        <v-input type="time" label="time" v-model="edit.time" required></v-input>

                        <button type="button" class="btn btn-primary" @click="$refs.f.reset()">Reset</button>
                    </template>
                </v-form>
            </div>
        </div>
        
        <hr/>
        <h1 id="table">Table</h1>
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn"></div> 
                <h4 class="panel-title">v-table</h4>
            </div> 
            <div class="panel-body">
                <v-table :rows="table" :cols="fields">
                    <template slot="buttons">
                        <button class="btn btn-sm btn-primary">New User</button>
                    </template>
                </v-table>
            </div>
        </div>
    </div>
</template>

<script>
import table from './data/table.js';
import components from './components.js';

export default {
    name: 'app',
    mounted(){
        this.$appReady();
    },
    data(){
        return {
            table : table,
            fields : [
                {
                    name : "title",
                    display : row => `${row.index}. ${row.name.last} ${row.name.last}`,
                    value : {
                        sort : row => row.index,
                    }
                },
                "eyeColor",
                "age",
                {
                    name : "isActive",
                    width : "20px"
                },
                {
                    name : "phone",
                    head : "Phone #"
                },
                "address",
                {
                    name : "test",
                    display : row => 12345678 + row.age
                }
  
            ]
        }
    },
    methods : {
        print(val){
            window.console.log(val);
        }
    },
    components 
}
</script>
