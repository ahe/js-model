Model.ClassMethods = {
  add: function() {
    var added = [];

    for (var i = 0; i < arguments.length; i++) {
      var model = arguments[i];
      var existing_elem = this.detect(function() {
        return this.id() !== null && this.id() == model.id();
      });

      if (!existing_elem) {
        this.collection.push(model);
        added.push(model);
      }
    }

    if (added.length > 0) this.trigger("add", added);

    return this;
  },

  all: function() {
    return this.collection;
  },

	load: function(callback) {
		this.persistence.load(this, function(success, xhr, data) {
			for(i=0; i < data.length; i++) {
				if(data[i][this._name]) {
					this.add(new this(data[i][this._name]));
				} else {
					this.add(new this(data[i]));
				}
			}
			callback.call(this, success);
	  });
	},

  count: function() {
    return this.collection.length;
  },

  detect: function(func) {
    var model;
    jQuery.each(this.all(), function(i) {
      if (func.call(this, i)) {
        model = this;
        return false;
      }
    });
    return model || null;
  },

  each: function(func) {
    jQuery.each(this.all(), function(i) {
      func.call(this, i);
    });
    return this;
  },

  find: function(id) {
    return this.detect(function() {
      return this.id() == id;
    }) || null;
  },

  first: function() {
    return this.all()[0] || null;
  },

  last: function() {
    var all = this.all();
    return all[all.length - 1] || null;
  },

  remove: function(id) {
    var ids = _.invoke(this.collection, 'id');
    var index = _.indexOf(ids, id);
    if (index > -1) {
      this.collection.splice(index, 1);
      this.trigger("remove");
      return true;
    } else {
      return false;
    }
  },

  select: function(func) {
    var selected = [];
    jQuery.each(this.all(), function(i) {
      if (func.call(this, i)) selected.push(this);
    });
    return this.chain(selected);
  },

  sort: function(func) {
    var sorted = _.sortBy(this.all(), function(model, i) {
      return func.call(model, i);
    });
    return this.chain(sorted);
  }
};
