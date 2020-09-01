import React from 'react';
import './trainer.css';
import bg from '../../images/bg.jpg';

const localStorageEnum = {
    trainerId: 'trainerId',
}
class Trainer extends React.Component {
    constructor(props) {
        super(props);
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
            sortedPokemon: [],
            data: '',
        }
    }

    componentDidMount = async () => {
        if (!this.state.trainerId) {
            const trainerId = localStorage.getItem(localStorageEnum.trainerId);
            const res = await fetch(`http://localhost:3000/trainer/${trainerId}`);
            if (!res.ok) {
                const error = await res.text();
                return console.log(error);
            }
            const data = await res.json();
            if (data) {
                console.log(data.pokecollection.pokemons);
                data.pokecollection.pokemons.forEach((pokemon) => {
                    this.setState(() => ({
                        newTrainer: data.name,
                        newTrainerId: data._id,
                        newTrainerCurrency: data.currency,
                        pokeCollectionId: data.pokecollection,
                        pokemonSpirite: [...this.state.pokemonSpirite, pokemon.sprite],
                        pokemonName: [...this.state.pokemonName, pokemon.name],
                        data: data.pokecollection.pokemons,
                    }));
                });
            }
        }
    }

    postTrainer = async () => {
        const message = {
            name: `${this.state.name}`,
        };
        await fetch('http://localhost:3000/trainer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(message),
        })
            .then((res) => {
                if (!res.ok) throw Error(res.statusText);
                return res.json();
            })
            .then(async (res) => {
                this.setState(() => ({
                    newTrainer: res.name,
                    newTrainerId: res._id,
                    newTrainerCurrency: res.currency,
                    pokeCollectionId: res.pokecollection,

                }));
                localStorage.setItem(localStorageEnum.trainerId, res._id);
            });
    }

    buyBackPokemonPack = async () => {
        const newPack = {
            trainerId: `${this.state.newTrainerId}`,
            packType: 'basic',
        };
        await fetch('http://localhost:3000/pokeCollection/pack', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(newPack),
        })
            .then((res) => {
                if (!res.ok) {
                    this.setState(() => ({
                        error: 'Sorry, you do not have enough money.',
                    }));
                }
                return res.json();
            })
            .then(async (res) => {
                res.map((basicPokemon) => this.setState(() => ({
                    pokemonSpirite: [...this.state.pokemonSpirite, basicPokemon.sprite],
                })));
            });
    }

    buyPremiumPokemonPack = async () => {
        const newPack = {
            trainerId: `${this.state.newTrainerId}`,
            packType: 'premium',
        };
        await fetch('http://localhost:3000/pokeCollection/pack', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(newPack),
        })
            .then((res) => {
                if (!res.ok) {
                    this.setState(() => ({
                        error: 'Sorry, you do not have enough money.',
                    }));
                }
                return res.json();
            })
            .then(async (res) => {
                res.map((premiumPokemon) => this.setState(() => ({
                    pokemonSpirite: [...this.state.pokemonSpirite, premiumPokemon.sprite],
                })));
            });
    }

    getCurrency = (e) => {
        const currency = e.target.value;
        this.setState(() => ({
            currency,
        }));
    }

    handleNameChange = (e) => {
        const name = e.target.value;
        this.setState(() => ({
            name,
        }));
    }

    handleIdChange = (e) => {
        const trainerId = e.target.value;
        this.setState(() => ({
            trainerId,
        }));
    }

    ascendingSort = () => {
        const compareNameAZ = (a, b) => {
            return (a['name'].toLowerCase() > b['name'].toLowerCase()) ? 1 : (a['name'].toLowerCase() < b['name'].toLowerCase()) ? -1 : 0;
        }
        const sort = this.state.data.sort(compareNameAZ)
        const sortedSpirte = [];
        for (var i = 0; i < sort.length; i++) {
            sortedSpirte.push(sort[i].sprite)
        }
        this.setState(() => ({
            pokemonSpirite: sortedSpirte
        }))
    }

    descendingSort = () => {
        const compareNameAZ = (b, a) => {
            return (a['name'].toLowerCase() > b['name'].toLowerCase()) ? 1 : (a['name'].toLowerCase() < b['name'].toLowerCase()) ? -1 : 0;
        }
        const sortedSpirte = [];
        const sort = this.state.data.sort(compareNameAZ)
        for (var i = 0; i < sort.length; i++) {
            sortedSpirte.push(sort[i].sprite)
        }
        this.setState(() => ({
            pokemonSpirite: sortedSpirte
        }))
    }

    idSort = () => {
        const compareNameAZ = (a, b) => {
            return (a['_id'] > b['_id']) ? 1 : (a['_id'] < b['_id']) ? -1 : 0;
        }
        const sort = this.state.data.sort(compareNameAZ)
        const sortedSpirte = [];
        for (var i = 0; i < sort.length; i++) {
            sortedSpirte.push(sort[i].sprite)
        }
        this.setState(() => ({
            pokemonSpirite: sortedSpirte
        }))
    }

    raritySort = () => {
        const compareNameAZ = (a, b) => {
            return (a['rarity'] > b['rarity']) ? 1 : (a['rarity'] < b['rarity']) ? -1 : 0;
        }
        const sort = this.state.data.sort(compareNameAZ)
        const sortedSpirte = [];
        for (var i = 0; i < sort.length; i++) {
            sortedSpirte.push(sort[i].sprite)
        }
        this.setState(() => ({
            pokemonSpirite: sortedSpirte
        }))
    }

    render() {
        return (
            <>
                <div className="bg" style={{ backgroundImage: `url(${bg})` }}></div>
                <div className="trainer-container">
                    <div className="trainer-group">
                        {this.state.trainerId.length < 0 &&
                            <div>
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
                            </div>
                        }
                        <div className="trainer-results">
                            <div className="error">{this.state.error}</div>
                            <div className="welcome">Welcome {this.state.newTrainer}!</div>
                            <div>Currency: ${this.state.newTrainerCurrency}</div>
                            <div>Trainer ID: {this.state.newTrainerId}</div>
                            <div className="pack-buttons">
                                <div className="premium-button" onClick={this.buyPremiumPokemonPack}>Buy Premium Pokemon Pack</div>
                                <div className="basic-button" onClick={this.buyBackPokemonPack}>Buy Basic Pokemon Pack</div>
                            </div>
                            <select onChange={(e) => {
                                const value = e.target.value;
                                if (value === 'az') {
                                    this.ascendingSort();
                                }
                                if (value === 'za') {
                                    this.descendingSort();
                                }
                                if (value === 'id') {
                                    this.idSort();
                                }
                                if (value === 'rarity') {
                                    this.raritySort()
                                }
                            }} name="sort" id="sort">
                                <option value="">Sort</option>
                                <option value="az">A-Z</option>
                                <option value="za">Z-A</option>
                                <option value="id">ID</option>
                                <option value="rarity">Rarity</option>
                            </select>
                            {/* <input
                                value={this.state.currency}
                                onChange={this.getCurrency}
                            /> */}
                            {/* <button onClick={this.addCurrency}>Add Currency</button> */}
                            <div>
                                <div>Pokemon Collection</div>
                                {this.state.pokemonSpirite.map((spirte) => <img alt="pokemon" src={spirte} />)}
                                {this.state.sortedPokemon.map((pokemon) => <div>{pokemon.name}</div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Trainer;
