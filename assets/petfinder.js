var config = {
    apiKey: "AIzaSyBj0VNeS_U8PR-NDxZNYUnfb67Ca76FEzw",
    authDomain: "bestfriendfinder-26231.firebaseapp.com",
    databaseURL: "https://bestfriendfinder-26231.firebaseio.com",
    projectId: "bestfriendfinder-26231",
    storageBucket: "bestfriendfinder-26231.appspot.com",
    messagingSenderId: "739384275677"
  };

firebase.initializeApp(config);
var db = firebase.database().ref();

var PetFinderAPIKey = "156a1b8fa2233c99240e24d804ef4754";

function getPets() {
	console.log("getPets");

	var animalType = $("#animalType").val().trim();
	var zipCode = $("#zipCode").val().trim();

	db.push({
		animalType: animalType,
		zipCode: zipCode,
	});

	var queryURL = "https://api.petfinder.com/pet.find";

	$.ajax({
		url: queryURL,
		jsonp: "callback",
		dataType: "jsonp",
		data: {
			key: PetFinderAPIKey,
			animal: animalType,
			location: zipCode,
			output: "basic",
			format: "json",
			count: 5,
		},
		success: function(petApiData) {
			console.log(petApiData);
			var pets = petApiData.petfinder.pets.pet;
			console.log(pets);
			for (var i = 0; i < pets.length; i++) {
				var animalDiv = $("<div class ='animalDiv'>");

				var animalName = pets[i].name.$t;
				var animalNameDiv = $("<h2>").text(animalName);
				animalDiv.append(animalNameDiv);

				var animalImageURL = pets[i].media.photos.photo[0].$t;
				var animalImage = $("<img class='animal'>").attr("src", animalImageURL);
				animalDiv.append(animalImage);

				var animalDescription = pets[i].description.$t;
				var animalDescriptionDiv = $("<p>").text(animalDescription);
				animalDiv.append(animalDescriptionDiv);

				$("#animalContainer").append(animalDiv);

				// NEED TO GENERATE A LIST OF SHELTERS
				// AND THEN PULL THE SHELTER INFO FROM PETFINDER TO GIVE TO THE GOOGLE MAPS API
			}
		}
	})
}

$(document).on("click","#petFinderSubmit",getPets);

// section below is just experimental, but i think we can use it to generate the secondary dropdown (animal > breed)
// but maybe not, may get unwieldy 

function getBreeds() {
	console.log("getBreeds");
	var queryURL = "https://api.petfinder.com/breed.list";
	var animalType = $("#animalType").val().trim();

	$.ajax({
		url: queryURL,
		jsonp: "callback",
		dataType: "jsonp",
		data: {
			key: PetFinderAPIKey,
			animal: animalType,
			output: "basic",
			format: "json",
		},
		success: function(breedResponse) {
			console.log(breedResponse.petfinder.breeds.breed);
		}
	})
}

$(document).on("click","#getBreedList", getBreeds);