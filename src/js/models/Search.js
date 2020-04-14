import axios from 'axios'; 

export default class Search {
    constructor (query){
        this.query=query;
    }
    async getResultes(){ //no need for parameter because it's using .this
        const url = 'https://forkify-api.herokuapp.com/api/search'
        try{
        const res = await axios(`${url}?q=${this.query}`);
        this.result = res.data.recipes;
        //console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}





