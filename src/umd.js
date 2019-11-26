import core from "./core.js";
import components from "./components.js";

/*global _:true*/
/*global Vue:true*/
Vue.use(core);
_.each(components,(component,name)=>{
    Vue.component(name,component);
});

window.VUI = {
    ...components
}