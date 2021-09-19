import axios from 'axios';

const API_URL = 'https://forkify-api.herokuapp.com/api/search';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults() {
        try {
            const res = await axios(`${API_URL}?q=${this.query}`);
            this.result = res.data.recipes;
        } catch (error) {
            if (error.message.includes(400)) {
                alert(
                    'Nothing found. Try searching for something else, like pizza'
                );
            } else {
                alert(error);
            }
        }
    }
}
