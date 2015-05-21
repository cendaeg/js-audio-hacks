function sum(terms) {
  return terms.reduce((a , b) => { return a+b });
}

class MusicMatrix {
  constructor() {
    this._previous_note = null;
    this._markov = new MarkovBuilder(["a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"]);
    this._timings = new MarkovBuilder([1, 2, 3, 4, 5, 6, 7, 8]);
  }
  add(to_note) {
    if(this._previous_note===null) {
      this._previous_note = to_note;
      return true;
    }
    var from_note = this._previous_note;
    this._markov.add(from_note[0], to_note[0]);
    this._timings.add(from_note[1], to_note[1]);
    this._previous_note = to_note;
  }
  next_note(from_note) {
    return [this._markov.next_value(from_note[0]), this._timings.next_value(from_note[1])];
  }
}

class MarkovBuilder {
  constructor(value_list) {
    this._values_added = 0;
    this._reverse_value_lookup = value_list;
    this._value_lookup = {};
    for (var i = 0; i < value_list.length; i++) {
      this._value_lookup[value_list[i]] = i;
    }
    this._matrix = [];
    for(var i = 0; i < value_list.length; i++) {
      this._matrix[i] = [];
      for(var j = 0; j < value_list.length; j++) {
        this._matrix[i][j] = 0;
      }
    }
  }
  add(from_value, to_value){
    //Add a path from a note to another note. Re-adding a path between notes will increase the associated weight.
    var value = this._value_lookup
    this._matrix[value[from_value]][value[to_value]] += 1
    this._values_added = this._values_added + 1
  }
  next_value(from_value) {
    var value = this._value_lookup[from_value]
    var value_counts = this._matrix[value]
    var value_index = this.randomly_choose(value_counts)
    if(value_index < 0) {
      throw "Non-existent value selected."
    } else {
      return this._reverse_value_lookup[value_index]
    }
  }
  randomly_choose(choice_counts) {
    //Given an array of counts, returns the index that was randomly chosen
    var counted_sum = 0;
    var count_sum = sum(choice_counts);
    var selected_count = Math.floor((Math.random() * (count_sum - 1) + 1));
    for (var i=0;i<choice_counts.length;i++) {
      counted_sum += choice_counts[i];
      if(counted_sum >= selected_count) {
        return i
      }
    }
    throw "Impossible value selection made. BAD!"
  }
}

var musicLearner = new MusicMatrix();


musicLearner.add(["d", 4])
musicLearner.add(["e", 3])
musicLearner.add(["e", 3])
musicLearner.add(["d", 4])
musicLearner.add(["e", 3])
musicLearner.add(["f", 4])

musicLearner.add(["c", 4])
musicLearner.add(["c", 4])
musicLearner.add(["c", 4])

musicLearner.add(["g", 4])
musicLearner.add(["g", 4])
musicLearner.add(["g", 4])

musicLearner.add(["e", 2])
musicLearner.add(["e", 4])
musicLearner.add(["e", 3])
musicLearner.add(["e", 4])
musicLearner.add(["e", 3])
musicLearner.add(["e", 4])
musicLearner.add(["e", 3])
musicLearner.add(["e", 4])
musicLearner.add(["e", 3])
musicLearner.add(["e", 4])

musicLearner.add(["c", 4])
musicLearner.add(["c", 4])
musicLearner.add(["c", 4])

musicLearner.add(["g", 3])
musicLearner.add(["f", 4])
musicLearner.add(["e", 3])
musicLearner.add(["d", 4])
