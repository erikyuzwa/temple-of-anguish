
class Repository {
    constructor(name, ctor) {
        this._name = name;
        this._templates = {};
        this._ctor = ctor;
        this._randomTemplates = {};
    }
    define (name, template, options) {
        this._templates[name] = template;
        // Apply any options
        var disableRandomCreation = options && options['disableRandomCreation'];
        if (!disableRandomCreation) {
            this._randomTemplates[name] = template;
        }
    }

// Create an object based on a template.
    create (name, extraProperties) {
        console.log(`attempting to create ${name}`)
        if (!this._templates[name]) {
            throw new Error(`No template named ${name} in repository ${this._name}`);
        }
        // Copy the template
       const template = Object.create(this._templates[name]);
        // Apply any extra properties
        if (extraProperties) {
            for (const key in extraProperties) {
                template[key] = extraProperties[key];
            }
        }

        // Create the object, passing the template as an argument
        return new this._ctor(template);
    }

    // Create an object based on a random template
    createRandom () {
        // Pick a random key and create an object based off of it.
        const keys = Object.keys(this._randomTemplates);
        const randKey = keys[ keys.length * Math.random() << 0];
        //debugger;
        console.log(`random key ${randKey}`)
        return this.create(randKey)
        //return this.create(Object.keys(this._randomTemplates).random());
    }
}
export default Repository