export default (t,r="") => `
<ValidationProvider v-slot="{ error }">
    <div class="v-input" :class="{'form-group':label, row : inline, 'invalid' : error}">
        <div v-if="label" :class="inline ? 'col-3 d-flex align-items-center' : ''">
            <label :class="inline ? 'mb-0' : ''">{{labelContent}}</label>
        </div>
        <div ref="inputGroup" :class="inputGroupClass">
                ${t}
                <div class="invalid-feedback">{{error}}</div>
            
        </div>
        ${r}
    </div>
</ValidationProvider> `