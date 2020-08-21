import React from 'react';
import './trainer.css';
import bg from '../../images/bg.jpg';

const localStorageEnum = {
    trainerId: 'trainerId',
}

class Trainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            trainerId: '',
            newTrainer: '',
            newTrainerId: '',
            newTrainerCurrency: 0,
            pokeCollectionId: '',
            pokemonSpirite: [],
            pokemonName: [],
            pokemonId: [],
            pokemonRarity: [],
            error: '',
            currency: 0,
        }
    }

    componentDidMount = async () => {
        if (!this.state.name) {
            const trainerId = localStorage.getItem(localStorageEnum.trainerId);
            const res = await fetch(`http://localhost:3000/trainer/${trainerId}`);
            if (!res.ok) {
                const error = await res.text();
                return console.log(error);
            }
            const data = await res.json();
            if (data) {
                console.log(data)
                this.setState(() => ({
                    newTrainer: data.name,
                    newTrainerId: data._id,
                    newTrainerCurrency: data.currency,
                    pokeCollectionId: data.pokecollection,
                }))
            }
        }
    }

    getPokecollection = () => {
        fetch(`http://localhost:3000/trainer/${this.state.newTrainerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                data.pokecollection.pokemons.forEach((pokemon) => {
                    this.setState(() => ({
                        pokemonSpirite: [...this.state.pokemonSpirite, pokemon.sprite],
                        pokemonName: [...this.state.pokemonName, pokemon.name],
                        pokemonRarity: [...this.state.pokemonRarity, pokemon.rarity],
                        pokemonId: [...this.state.pokemonId, pokemon._id],
                    }))
                })
            });
    }

    postTrainer = async () => {
        const message = {
            "name": `${this.state.name}`
        }
        await fetch(`http://localhost:3000/trainer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(message)
        })
            .then((res) => {
                if (!res.ok) throw Error(res.statusText);
                return res.json();
            })
            .then(async (res) => {
                console.log(res)
                this.setState(() => ({
                    newTrainer: res.name,
                    newTrainerId: res._id,
                    newTrainerCurrency: res.currency,
                    pokeCollectionId: res.pokecollection,

                }))
                localStorage.setItem(localStorageEnum.trainerId, res._id);
                console.log(localStorage)
            })
    }

    buyBackPokemonPack = async () => {
        const newPack = {
            "trainerId": `${this.state.newTrainerId}`,
            "packType": "basic",
        }
        await fetch(`http://localhost:3000/pokeCollection/pack`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newPack)
        })
            .then((res) => {
                if (!res.ok) {
                    this.setState(() => ({
                        error: 'Sorry, you do not have enough money.',
                    }))
                    console.log((res.statusText));
                }
                return res.json();
            })
            .then(async (res) => {
                res.map((basicPokemon) => {
                    return this.setState(() => ({
                        pokemonSpirite: [...this.state.pokemonSpirite, basicPokemon.sprite]
                    }))
                })
            })
    }

    buyPremiumPokemonPack = async () => {
        const newPack = {
            "trainerId": `${this.state.newTrainerId}`,
            "packType": "premium",
        }
        await fetch(`http://localhost:3000/pokeCollection/pack`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newPack)
        })
            .then((res) => {
                if (!res.ok) {
                    this.setState(() => ({
                        error: 'Sorry, you do not have enough money.',
                    }))
                    console.log((res.statusText));
                }
                return res.json();
            })
            .then(async (res) => {
                res.map((premiumPokemon) => {
                    return this.setState(() => ({
                        pokemonSpirite: [...this.state.pokemonSpirite, premiumPokemon.sprite]
                    }))
                })
            })
    }

    getCurrency = e => {
        const currency = e.target.value;
        this.setState(() => ({
            currency
        }))
    }

    handleNameChange = e => {
        const name = e.target.value;
        this.setState(() => ({
            name
        }))
    }
    handleIdChange = e => {
        const trainerId = e.target.value;
        this.setState(() => ({
            trainerId
        }))
    }

    render() {
        return (
            <>
                <div className="bg" style={{ backgroundImage: `url(${bg})` }}></div>
                <div className="trainer-container">
                    <div className="trainer-group">
                        <div className="trainer-header">Welcome to the Pokemon Game</div>
                        <div className="trainer-subheader">Enter your name to begin</div>
                        <div className="trainer-subheader">
                            <input
                                className="trainer-input"
                                value={this.state.name}
                                onChange={this.handleNameChange}
                                type="text"
                            />
                            <div className="trainer-button" onClick={this.postTrainer}>Submit</div>
                        </div>
                        <div className="trainer-results">
                            <div className="error">{this.state.error}</div>
                            <div>Welcome {this.state.newTrainer}!</div>
                            <div>Currency: ${this.state.newTrainerCurrency}</div>
                            <div>Your Trainer ID: {this.state.newTrainerId}</div>
                            <br></br>
                            <button onClick={this.buyPremiumPokemonPack}>Buy Premium Pokemon Pack</button>
                            <button onClick={this.buyBackPokemonPack}>Buy Basic Pokemon Pack</button>
                            <br></br>
                            <button onClick={this.getPokecollection}>See your pokemon collection</button>
                            <br></br>
                            <input
                                value={this.state.currency}
                                onChange={this.getCurrency}
                            />
                            <button onClick={this.addCurrency}>Add Currency</button>
                            <div>
                                <div>Pokemon Collection</div>
                                {this.state.pokemonSpirite.map((spirte) => {
                                    return <img alt="pokemon" src={spirte} />
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Trainer;
