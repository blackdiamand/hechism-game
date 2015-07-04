/**
 * Behold the bringer of light!
 */
dojo.declare("classes.managers.SpaceManager", com.nuclearunicorn.core.TabManager, {

	/*
	 * Planets and celestial bodies from left to right:
	 *
	 * Charon, Umbra (black hole), Yarn (terraformable?), Helios (Sun), Cath, Redmoon (Cath satellite), Dune, Piscine, Terminus (ice giant), Kairo (dwarf planet)
	 *
	 */

	game: null,

	programs: [{
		name: "orbitalLaunch",
		title: "Orbital Launch",
		description: "Launch a rocket to a space.",
		researched: false,
		unlocked: true,
		prices: [
			{name: "starchart", val: 250},
			{name: "manpower", val: 5000},
			{name: "science", val: 100000},
			{name: "oil", val: 15000}
		],
		handler: function(game, self){
			game.space.getProgram("sattelite").unlocked = true;
			game.space.getProgram("spaceStation").unlocked = true;
			game.space.getProgram("spaceElevator").unlocked = true;
			game.space.getProgram("moonMission").unlocked = true;
		}
	},{
		//===================================================
		//		TODO: move this to the engineeering section
		//===================================================
		name: "spaceElevator",
		title: "Space Elevator",
		description: "Every S. Elevator reduces oil requirements for space missions by 5%",
		researched: false,
		unlocked: false,
		upgradable:true,
		priceRatio: 1.15,
		prices: [
			{name: "titanium", val: 6000},
			{name: "science", val: 100000},
			{name: "unobtainium", val: 50},
		],
		requiredTech: ["orbitalEngineering", "nanotechnology"],
		val: 0,
		effects: {
			"oilReductionRatio": 0.05,
			"energyConsumption" : 5
		}
	},{
		name: "sattelite",
		title: "Deploy Satellite",
		description: "Deploy a satellite. Satellites improve your observatory effectiveness by 5% and produce starcharts",
		unlocked: false,
		prices: [
			{name: "starchart", val: 325},
			{name: "titanium", val: 2500},
			{name: "science", val: 125000},
			{name: "oil", val: 15000}
		],
		priceRatio: 1.08,
		requiredTech: ["sattelites"],
		val: 0,
		upgradable: true,
		effects: {
			"observatoryRatio": 0.05,
			"starchartPerTickBase": 0.001
		},
		upgrades: {
			buildings: ["observatory"]
		},
		action: function(game, self){
			self.effects["starchartPerTickBase"] = 0.001 * (1+ game.space.getEffect("spaceRatio"));
		}
			
	},{
		name: "spaceStation",
		title: "Deploy S. Station",
		description: "Deploy a space station. Each station generates science and provide a space for 2 astronauts",
		unlocked: false,
		prices: [
			{name: "starchart", val: 425},
			{name: "alloy", 	val: 750},
			{name: "science", val: 150000},
			{name: "oil", val: 35000}
		],
		priceRatio: 1.12,
		requiredTech: ["orbitalEngineering"],
		val: 0,
		upgradable: true,
		handler: function(game, self){
			game.ironWill = false;			//sorry folks
		},
		effects: {
			"scienceRatio": 0.5,
			"maxKittens": 2
		}
	},{
		name: "moonMission",
		title: "Moon Mission",
		description: "Launch a rocket to Redmoon, a Cath planet satellite",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 500},
			{name: "titanium", val: 5000},
			{name: "science", val: 125000},
			{name: "oil", val: 45000}
		],
		upgradable: false,
        unlocks: {
            planet: "moon",
            programs: ["moonBase", "moonOutpost", "duneMission", "piscineMission"]
        }
	},{
		name: "moonOutpost",
		title: "Lunar Outpost",
		description: "Deploy a nuclear powered mining outpost on Redmoon",
		unlocked: false,
		fuel: 50000,
		priceRatio: 1.12,
		prices: [
			{name: "starchart", val: 650},
			{name: "uranium",  val: 500},
			{name: "alloy",    val: 750},
			{name: "concrate", val: 150},
			{name: "science", val: 100000},
			{name: "oil", val: 55000}
		],
		upgradable: true,
		togglable: 	true,
		tunable: 	true,

		handler: function(game, self){
			//game.workshop.get("unobtainiumAxe").unlocked = true;
			//game.workshop.get("unobtainiumSaw").unlocked = true;
		},
		val:  0,
		on:	  0,
		effects: {
			"uraniumPerTick": -0.35,
			"unobtainiumPerTick": 0.007
		},
		action: function(game, self){
			
			self.effects["unobtainiumPerTick"] = 0.007 * (1+ game.space.getEffect("spaceRatio"));

			//TODO: move to resPool.convert(a, b)
			var uranium = game.resPool.get("uranium");
			if (uranium.value >= -self.effects["uraniumPerTick"] * self.on){
				uranium.value += self.effects["uraniumPerTick"] * self.on;
				game.resPool.get("unobtainium").value += self.effects["unobtainiumPerTick"] * self.on;
			} else {
				if (self.on > 0){
					self.on--;
				} else {
					self.on = 0;	//TODO: fix remove this later once actions are fixed correctly.
				}
			}
		}
	},{
		name: "moonBase",
		title: "Moon base",
		description: "Establish a base on a surface of Redmoon",
		unlocked: false,
		researched: false,
		priceRatio: 1.12,
		prices: [
			{name: "starchart", val: 700},
			{name: "titanium", val: 9500},
			{name: "concrate", val: 250},
			{name: "science", val: 100000},
			{name: "unobtainium", val: 50},
			{name: "oil", val: 70000}
		],
		effects: {
			"catnipMax" 	: 45000,
			"woodMax"		: 25000,
			"mineralsMax"	: 30000,
			"ironMax"		: 9000,
			"coalMax"		: 3500,
			"goldMax"		: 500,
			"titaniumMax"	: 1250,
			"oilMax"		: 3500,
			"unobtainiumMax": 150
		},
		upgradable: true,
		togglable: 	false,
		tunable: 	false,
		val: 0,
	},{
		name: "duneMission",
		title: "Dune Mission",
		description: "Dune is a large and lifeless planet covered by sand and volcanic rock.",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 1000},
			{name: "titanium", val: 7000},
			{name: "science", val: 175000},
			{name: "oil", val: 55000}
		],
		upgradable: false,
		handler: function(game, self){
			game.space.getProgram("heliosMission").unlocked = true;
		},
		unlocks: {
            planet: "dune"
        }
	},{
		name: "piscineMission",
		title: "Piscine Mission",
		description: "Piscine is a gigantic aquatic planet composed of an acid body and a methane atmosphere",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 1500},
			{name: "titanium", val: 9000},
			{name: "science", val: 200000},
			{name: "oil", val: 70000}
		],
		upgradable: false,
		handler: function(game, self){
			game.space.getProgram("terminusMission").unlocked = true;
		},
        unlocks: {
            planet: "piscine"
        }
	},{
		name: "heliosMission",
		title: "Helios Mission",
		description: "Helios is a G2V spectral type star in the center of the Cath solar system.",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 3000},
			{name: "titanium", val: 15000},
			{name: "science", val: 250000},
			{name: "oil", val: 95000}
		],
		upgradable: false,
		handler: function(game, self){
			game.space.getProgram("heliosMission").unlocked = true;
		},
        unlocks: {
            planet: "helios"
        }
	},{
		name: "terminusMission",
		title: "T-minus Mission",
		description: "Terminus is a supermassive ice giant at the far end of a Helios solar system.",
		unlocked: false,
		researched: false,
		prices: [
			{name: "starchart", val: 2500},
			{name: "titanium", val: 12000},
			{name: "science", val: 225000},
			{name: "oil", val: 80000}
		],
		upgradable: false,
		handler: function(game, self){
			game.space.getProgram("heliosMission").unlocked = true;
		},
        unlocks: {
            planet: "terminus"
        }
	}],

	//============================================================================

	planets:
	[{
		name: "moon",
		title: "Moon",
		unlocked: false
	},{
		name: "dune",
		title: "Dune",
		unlocked: false,
        buildings: [{
            name: "planetCracker",
            title: "Planet Cracker",
            description: "USS Mining Vessel Hissmeowra that can crack an entire planet",
            unlocked: true,
            priceRatio: 1.18,
            prices: [
                {name: "starchart", val: 2500},
                {name: "alloy",  val: 1750},
                {name: "science", val: 125000},
                {name: "oil", val: 125000}
            ],

            upgradable: true,
            togglable: 	false,
            tunable: 	false,
            val:  0,
            on:	  0,
            effects: {
				"uraniumPerTick" : 0.3,
				"uraniumMax" : 1750
			},
            action: function(game, self){
				
				self.effects["uraniumPerTick"] = 0.3 
					* (1 + game.workshop.getEffect("crackerRatio")) 
					* (1+ game.space.getEffect("spaceRatio"));
				
				//TODO: use calculateEffects method
				game.resPool.get("uranium").value += self.effects["uraniumPerTick"] * self.val;
            }
        }]
	},{
		name: "piscine",
		title: "Piscine",
		unlocked: false,
		buildings: [{
            name: "researchVessel",
            title: "Research Vessel",
            description: "Mobile research space vessel.",
            unlocked: true,
            priceRatio: 1.15,
            prices: [
                {name: "starchart", val: 500},
                {name: "alloy",  val: 2500},
                {name: "titanium", val: 12500},
                {name: "oil", val: 175000}
            ],
            upgradable: true,
            togglable: 	false,
            tunable: 	false,
            val:  0,
            on:	  0,
            effects: {
				"scienceMax": 10000,
				"starchartPerTickBase": 0.01
			},
            action: function(game, self){
				self.effects["starchartPerTickBase"] = 0.01 * (1+ game.space.getEffect("spaceRatio"));
            }
        },{
            name: "orbitalArray",
            title: "Orbital Array",
            description: "Provide a 2% production bonus to all space structures",
            unlocked: true,
            priceRatio: 1.15,
            prices: [
                {name: "eludium",  val: 100},
                {name: "science", val: 250000},
                {name: "oil", val: 200000}
            ],
            upgradable: true,
            togglable: 	false,
            tunable: 	false,
            val:  0,
            on:	  0,
            effects: {
				"spaceRatio": 0.02,
				"energyConsumption" : 10
			},
            action: function(game, self){
            }
        }]
	},{
		name: "helios",		//technically it is a planet from the game point of view
		title: "Helios",
		unlocked: false,
		buildings: [{
            name: "sunlifter",
            title: "Sunlifter",
            description: "Generates antimatter (TBD)",
            unlocked: true,
            priceRatio: 1.15,
            prices: [
                {name: "science", val: 500000},
                {name: "eludium", val: 250},
                {name: "oil", val: 250000}
            ],
            upgradable: true,
            togglable: 	false,
            tunable: 	false,
            val:  0,
            on:	  0,
            effects: {
			},
            action: function(game, self){
            }
        }]
	},{
		name: "terminus",
		title: "T-Minus",
		unlocked: false
	}],

	//============================================================================

	constructor: function(game){
		this.game = game;
	},

	save: function(saveData){
		saveData.space = {
			programs: this.programs,
			planets: this.planets
		}
	},

	load: function(saveData){
		if (!saveData.space){
			return;
		}

		var self = this;

		if (saveData.space.programs){
			this.loadMetadata(this.programs, saveData.space.programs, ["val", "on", "unlocked", "researched"], function(loadedElem){
				//TODO: move to common method (like 'adjust prices'), share with religion code
				var prices = dojo.clone(loadedElem.prices);
				for (var k = prices.length - 1; k >= 0; k--) {
					var price = prices[k];
					for (var j = 0; j < loadedElem.val; j++){
						price.val = price.val * loadedElem.priceRatio;
					}
				}
			});
		}
		// programs and shit
		for (var i = this.programs.length - 1; i >= 0; i--) {
			var program = this.programs[i];
			if (program.researched){
				if (program.handler) {
					program.handler(this.game, program);
				}

				if (program.unlocks){
					//TODO: move to some common method?
					if (program.unlocks.planet){
						this.game.space.getPlanet(program.unlocks.planet).unlocked = true;
					}
					if (program.unlocks.programs){
						dojo.forEach(program.unlocks.programs, function(uprogram, i){
							self.game.space.getProgram(uprogram).unlocked = true;
						});
					}
				}
			}
		}
		//planets
		if (saveData.space.planets){
			for (var i in saveData.space.planets){
				var savePlanet = saveData.space.planets[i];
				var planet = this.getMeta(savePlanet.name, this.planets);

				if (savePlanet.buildings){
					this.loadMetadata(planet.buildings, savePlanet.buildings, ["val", "on", "unlocked"], function(loadedElem){
					});
				}
			}
		}
	},

	update: function(){
		for (var i = this.programs.length - 1; i >= 0; i--) {
			var program = this.programs[i];
			if (program.action && program.val > 0){
				program.action(this.game, program);
			}
		}
		for (var i in this.planets){
			var planet = this.planets[i];
			for (var j in planet.buildings){
				var bld = planet.buildings[j];
				if (bld.action && bld.val > 0){
					bld.action(this.game, bld);
				}
			}
		}
	},

	getProgram: function(name){
		return this.getMeta(name, this.programs);
	},

	getPlanet: function(name){
		return this.getMeta(name, this.planets);
	},

	getEffect: function(name){
		var self = this;

		return this.getMetaEffect(name, { meta:this.programs, provider: {
			getEffect: function(program, effectName){
				if (!program.effects){
					return 0;
				}

				var val = program.togglable ? program.on: program.val;
				return program.upgradable ?
					program.effects[effectName] * val:
					program.effects[effectName];
			}
		}}) +
		
		// i dont know what went wrong
		this.getMetaEffect(name, { meta:this.planets, provider: {
			getEffect: function(planet, effectName){
				return self.getMetaEffect(effectName, {meta: planet.buildings, provider: {
					getEffect: function(building, effectName){
						if (!building.effects){
							return 0;
						}
						var val = building.togglable ? building.on: building.val;
						return building.effects[effectName] * val;
					}
				}});
			}
		}});
	}
});

dojo.declare("com.nuclearunicorn.game.ui.SpaceProgramBtn", com.nuclearunicorn.game.ui.BuildingBtn, {

	program: null,
	simplePrices: false,

	constructor: function(opts, game) {

	},

	getProgram: function(){
		if (!this.program){
			this.program = this.game.space.getProgram(this.id);
		}
		return this.program;
	},

	getBuilding: function(){
		return this.getProgram();
	},

	hasSellLink: function(){
		return false;
	},

	getPrices: function(){
		var prices = dojo.clone(this.getProgram().prices);

		var program = this.getProgram();
		var ratio = program.priceRatio || 1.15;

		var prices = dojo.clone(program.prices);
		if (program.upgradable){
			for (var i = program.val - 1; i >= 0; i--) {
				for (var j = prices.length - 1; j >= 0; j--){
					//Hack to set oil price increase separately:
					if (prices[j].name !== "oil") {
						prices[j].val = prices[j].val * ratio;
					} else {
						prices[j].val = prices[j].val * 1.05;			//5% oil increase
					}
				}
			}
		}
		for (var i = prices.length - 1; i >= 0; i--) {
			if (prices[i].name == "oil"){
				var reductionRatio = this.game.bld.getHyperbolicEffect(this.game.space.getEffect("oilReductionRatio"), 0.75);
				prices[i].val *= (1 - reductionRatio);
			}
		}

		return prices;
	},

	updateVisible: function(){
		var program = this.getProgram();
		if (program.requiredTech){
			for (var i = program.requiredTech.length - 1; i >= 0; i--) {
				var tech = this.game.science.get(program.requiredTech[i]);
				if (!tech.researched){
					this.setVisible(false);
					return;
				}
			}
		}
		this.setVisible(this.getProgram().unlocked);
	},

	updateEnabled: function(){
		this.inherited(arguments);
		if (this.getProgram().researched && !this.getProgram().upgradable){
			this.setEnabled(false);
		}
	},

	onClick: function(){
		var self = this;

		this.animate();
		var program = this.getProgram();
		if (this.enabled && this.hasResources()){

			this.payPrice();

			if (program.upgradable){
				program.val++;
			}

			this.handler(this);

			if (program.unlocks){
				if (program.unlocks.planet){
					this.game.space.getPlanet(program.unlocks.planet).unlocked = true;
				}
				if (program.unlocks.programs){
					dojo.forEach(program.unlocks.programs, function(uprogram, i){
						self.game.space.getProgram(uprogram).unlocked = true;
					});
				}
			}

			if (program.upgrades){
				this.game.upgrade(program.upgrades);
			}

			this.update();
		}
	},


	getName: function(){
		var program = this.getProgram();
		if (!program.upgradable && program.researched){
			return program.title + " (Complete)";
		}else if (program.upgradable){
			return this.inherited(arguments);
		}else {
			return program.title;
		}
	},

	getDescription: function(){
		var program = this.getProgram();
		return program.description;
	},

	getEffects: function(){
		var program = this.getProgram();
		return program.effects;
	}
});

dojo.declare("classes.ui.space.PlanetBuildingBtn", com.nuclearunicorn.game.ui.SpaceProgramBtn, {
	planet: null,

	setOpts: function(opts){
		this.inherited(arguments);
		this.planet = opts.planet;
	},

	getProgram: function(){
		var space = this.game.space;
		if (!this.program){
			var planet = space.getMeta(this.planet.name, space.planets);
			this.program = space.getMeta(this.id, this.planet.buildings);

		}
		return this.program;
	},

	onClick: function(){
		var self = this;

		this.animate();
		var program = this.getProgram();
		if (this.enabled && this.hasResources()){

			this.payPrice();
			program.val++;
			if (program.handler){
				program.handler(btn.game, program);
			}
		}
	}
});

dojo.declare("classes.ui.space.PlanetPanel", com.nuclearunicorn.game.ui.Panel, {
	planet: null,

	render: function(){
		var content = this.inherited(arguments);

		var self = this;

		dojo.forEach(this.planet.buildings, function(building, i){
			var button = new classes.ui.space.PlanetBuildingBtn({
				id: 		building.name,
				name: 		building.title,
				description: building.description,
				prices: building.prices,
				planet: self.planet
			}, self.game);

			button.render(content);
			self.addChild(button);
		});
	}
});

dojo.declare("com.nuclearunicorn.game.ui.tab.SpaceTab", com.nuclearunicorn.game.ui.tab, {

	GCPanel: null,

	constructor: function(){

	},

	render: function(container) {
		var self = this;
		this.GCPanel = new com.nuclearunicorn.game.ui.Panel("Ground Control", this.game.space);
		var content = this.GCPanel.render(container);

		dojo.forEach(this.game.space.programs, function(program, i){
			var button = new com.nuclearunicorn.game.ui.SpaceProgramBtn({
				id: 		program.name,
				name: 		program.title,
				description: program.description,
				prices: program.prices,
				handler: function(btn){
					var program = btn.getProgram();
					program.researched = true;

					if (program.handler){
						program.handler(btn.game, program);
					}
				}
			}, self.game);
			button.render(content);
			self.GCPanel.addChild(button);
		});

        //------------ space space I'm in space -------------
        this.planetPanels = [];
        dojo.forEach(this.game.space.planets, function(planet, i){
            if (planet.unlocked){
                var planetPanel = new classes.ui.space.PlanetPanel(planet.title, self.game.space);
                planetPanel.planet = planet;
                planetPanel.setGame(self.game);
                var content = planetPanel.render(container);

                self.planetPanels.push(planetPanel);
            }
        });

	},

	update: function(){
		this.GCPanel.update();

        dojo.forEach(this.planetPanels, function(panel, i){
            panel.update();
        });
	}
});
