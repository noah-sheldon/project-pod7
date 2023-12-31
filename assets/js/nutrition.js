import { NUTRITION_API_KEY } from "./config.js";
import { NUTRITION_API_ID } from "./config.js";

var nutriEndPoint = "https://api.edamam.com/api/nutrition-details";
var caloriesTotal = 0;
var weightTotal = 0;
var recipeIngredients = [];

function getData(ingreArray) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    ingr: ingreArray,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  var queryURL =
    "" +
    nutriEndPoint +
    "?app_id=" +
    NUTRITION_API_ID +
    "&app_key=" +
    NUTRITION_API_KEY;

  fetch(queryURL, requestOptions)
    .then(function (data) {
      return data.json();
    })
    .then(function (data) {
      console.log(data);
      getSummaryInfo(data);
    });
}

function getSummaryInfo(inputData) {
  for (let i = 0; i < inputData.length; i++) {
    var tableRow = $("<tr>");

    const firstValue = Object.values(inputData.ingredients[i])['text'];
    $("#nutriTbody")
      .append(tableRow)
      .append("<td>" + firstValue + "</td>")
      .append("<td>" + inputData.calories + " kcal</td>")
      .append("<td>" + inputData.totalWeight.toFixed(0) + " grams</td>");

    // Update the total calories and weight
    caloriesTotal += inputData.calories;
    weightTotal += inputData.totalWeight;

    // Update the totals row
    updateTotalsRow();
  }
}

function updateTotalsRow() {
  // Remove the existing totals row
  $("#totalsRow").remove();

  // Create a new totals row
  var totalsRow = $('<tr class="table-secondary" id="totalsRow">')
    .append("<th>Total</th>")
    .append("<th>" + caloriesTotal.toFixed(0) + " KCAL</th>")
    .append("<th>" + weightTotal.toFixed(0) + " grams</th>");

  // Append the totals row to the table body
  $("#nutriTbody").append(totalsRow);
}

function getArray() {
  $("#nutritionDiv").empty();
  // Get the content of the textarea
  var str = document.getElementById("ingredientTextArea").value;

  if (!str) {
    alert("Please enter some ingredients!");
    return;
  }

  if (!str.includes(",")) {
    alert("Please add commas between each ingredient!");
    return;
  }

  // Split the content into an array using commas as the delimiter
  recipeIngredients = str.split(",");

  // Trim each string to remove whitespaces
  recipeIngredients = recipeIngredients.map(function (str) {
    return str.trim();
  });

  createTable();
  getData(recipeIngredients);
}

function createTable() {
  var nutriDiv = $("<div class='nutri-result'>");
  var nutriDiv2 = $("<div class='col-md-12'>");

  // create table
  var table = $(
    "<table class='table table-striped' style='margin-top: 30px; border: 1px solid #808080;'>"
  );

  // table header
  var headerRow = $("<tr>")
    .append("<th scope='col' style='width: 40%;'>Quantity / Unit / Food</th>")
    .append("<th scope='col' style='width: 30%;'>Calories</th>")
    .append("<th scope='col' style='width: 30%;'>Weight</th>");

  $("<thead class='table-secondary'>").append(headerRow).appendTo(table);

  // table body
  var tableBody = $("<tbody id='nutriTbody'>");
  table.append(tableBody);

  // append the table to the nutriForm
  $("#nutritionDiv").append(nutriDiv).append(nutriDiv2).append(table);
}

$("#submitBtn").click(function (event) {
  event.preventDefault();
  getArray();
  console.log(recipeIngredients);
});
