import React from 'react';
import './trainer.css';
import bg from '../../images/bg.jpg';

const localStorageEnum = {
    trainerId: 'trainerId',
}
class Trainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount = async () => {
    const trainerId = localStorage.getItem(localStorageEnum.trainerId);
    if (trainerId) {
      const res = await fetch(`http://localhost:3000/trainer/${trainerId}`);
      if (!res.ok) {
        const error = await res.text();
        return console.log(error);
      }
      const data = await res.json();
      if (data) {
        this.setState(() => ({
          newTrainer: data.name,
          newTrainerId: data._id,
          newTrainerCurrency: data.currency,
          pokeCollection: data.pokecollection,
        }));
      }
    }
  }

  postTrainer = async () => {
    const message = {
      name: `${this.state.name}`,
    };
    const res = await fetch('http://localhost:3000/trainer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(message),
    });
    if (!res.ok) throw Error(res.statusText);
    const data = await res.json();
    this.setState(() => ({
      newTrainer: data.name,
      newTrainerId: data._id,
      newTrainerCurrency: data.currency,
      pokeCollection: data.pokecollection,
    }));
    localStorage.setItem(localStorageEnum.trainerId, data._id);
  }

  setStateFxn = (data) => {
    return this.setState({
      pokeCollection: {
        ...this.state.pokeCollection,
        pokemons: [...this.state.pokeCollection.pokemons, ...data]
      }
    });
  }

  buyBackPokemonPack = async () => {
      const newPack = {
          trainerId: `${this.state.newTrainerId}`,
          packType: 'basic',
      };
      let res = await fetch('http://localhost:3000/pokeCollection/pack', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
          },
          body: JSON.stringify(newPack),
      })
      if (!res.ok) {
          return this.setState({ error: 'Sorry, you do not have enough money.' });
      }
      const data = await res.json();
      if (this.state.pokeCollection.pokemons){
        this.setStateFxn(data)
      } else {
        this.setState({
          pokeCollection: {
            ...this.state.pokeCollection,
            pokemons: [...data]
          }
        });
      }
    }

  buyPremiumPokemonPack = async () => {
    const newPack = {
        trainerId: `${this.state.newTrainerId}`,
        packType: 'premium',
    };
    let res = await fetch('http://localhost:3000/pokeCollection/pack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(newPack),
    })
    if (!res.ok) {
      return this.setState({ error: 'Sorry, you do not have enough money.' });
    }
    const data = await res.json();
    if (this.state.pokeCollection.pokemons){
      this.setStateFxn(data)
    } else {
      this.setState({
        pokeCollection: {
          ...this.state.pokeCollection,
          pokemons: [...data]
        }
      });
    }
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

  // redo all the sorts
  ascendingSort = () => {
    const compareName = (a, b) => {
      return (a['name'].toLowerCase() > b['name'].toLowerCase()) ? 1 : (a['name'].toLowerCase() < b['name'].toLowerCase()) ? -1 : 0;
    }
    const sort = this.state.pokeCollection.pokemons.sort(compareName)
    this.setState(() => ({
      pokeCollection: {
        pokemons: sort
      }
    }))
  }

  descendingSort = () => {
    const compareName = (b, a) => {
      return (a['name'].toLowerCase() > b['name'].toLowerCase()) ? 1 : (a['name'].toLowerCase() < b['name'].toLowerCase()) ? -1 : 0;
    }
    const sort = this.state.pokeCollection.pokemons.sort(compareName)
    this.setState(() => ({
      pokeCollection: {
        pokemons: sort
      }
    }))
  }

  idSort = () => {
      const compareName = (a, b) => {
        return (a['_id'] > b['_id']) ? 1 : (a['_id'] < b['_id']) ? -1 : 0;
      }
    const sort = this.state.pokeCollection.pokemons.sort(compareName)
    this.setState(() => ({
      pokeCollection: {
        pokemons: sort
      }
    }))
  }

  raritySort = () => {
      const compareName = (a, b) => {
        return (a['rarity'] > b['rarity']) ? 1 : (a['rarity'] < b['rarity']) ? -1 : 0;
      }
      const sort = this.state.pokeCollection.pokemons.sort(compareName)
      this.setState(() => ({
        pokeCollection: {
          pokemons: sort
        }
      }))
  }

  render() {
    return (
      <>
        <div className="bg" style={{ backgroundImage: `url(${bg})` }}></div>
        <div className="trainer-container">
          <div className="trainer-group">
            {!this.state.newTrainer &&
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
            {this.state.newTrainer &&
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
                <div>
                  <div>Pokemon Collection</div>
                  {/* add names and numbers etc */}

                  {this.state.pokeCollection.pokemons && this.state.pokeCollection.pokemons.map(pokemon => <img alt="pokemon" src={pokemon.sprite} />)}
                </div>
              </div>
            }
          </div>
        </div>
      </>
    );
  }
}

export default Trainer;
