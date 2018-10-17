//////////// OLD SCHOOL ////////////

function Pokemon(name) {
    this.name
}

Pokemon.prototype.sayHello = () => {
    console.log(
        `Hello World, I am ${this.name}`
    )
}

var simone = new Pokemon('Vulpix')
simone.sayHello()


//////////// ES6 ////////////

//////////// Class declarations are NOT hoisted!! ////////////

class Pokemon {
    constructor(name, weight, trainer){
        this.name = name
        this.weight = weight
        this.trainer = trainer
    }
    pokedex(){
        console.log(
            `Hello World, My Name is ${this.name}. My Weight is ${this.weight} and my trainer is ${this.trainer}`
        )
    }
}

class Pikachu extends Pokemon { // --> Class Pikachu (child) inherits the properties of the Pokemon class (parent)
        constructor(name, weight, trainer){
        super(name, weight, trainer) // Runs (calls) the constructor method of the parent class (Pokemon)
    }
    static isPokemon(x){
        return x instanceof Pokemon
    }
    headbutt(){
        console.log('HEADBUTT! BOOM')
    }
}

class Bulbasaur extends Pokemon{
    constructor(n, w, t){
        super(n, w, t)
    }
    vineWhip(){
        console.log(`${this.name}` runs VINEWHIP! WHIP WHIP!);
    }
}

const sally = new Pikachu('Sally', 10, 'Panu')
const bartholomieu = new Bulbasaur('Bartholomieu', 30, 'K')

bartholomieu.headbutt()

console.log("static: ", Pikachu.isPokemon(sally))

sally.headbutt()

const ralph = new Pokemon("GeoDude")
ralph.sayHello()

- - - - - - - - - - - - - -

addEventListener('hashchange', () => {
    app.currentImageId = location.hash.slice(1)
})

location.hash = '';

vue.component({
    props: ['id'],
    watch: {
        id: function() {
            this.getImageInfo()
        }
    },
    mounted: function(){
        this.getImageInfo()
    },
    methods: {
        getImageInfo: function() {
            axios.get('/image' + this.id)
        }
    }
})

SELECT * FROM images
WHERE id > $1
ORDER BY id DESC
LIMIT 10;
