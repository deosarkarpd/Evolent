var app = angular.module('MyApp', [])
app.controller('MyController', function ($scope, $http, $window) {
	//Getting records from database.
	var post = $http({
		method: "POST",
		url: "/Home/GetCustomers",
		dataType: 'json',
		headers: { "Content-Type": "application/json" }
	});
	post.success(function (data, status) {
		//The received response is saved in array.
		$scope.Customers = data;
	});

	//Adding new record to database.
	$scope.Add = function () {
		var phon = $scope.PhoneNo;
		if ((phon.length > 10) || (phon.length < 10)) {
			alert('Please enter correct phone no.');
			return;
		}
		
		if (typeof ($scope.FirstName) == "undefined" || typeof ($scope.LastName) == "undefined" || typeof ($scope.Email) == "undefined" || typeof ($scope.PhoneNo) == "undefined" ) {
			return;
		}
		if (!checkEmail($scope.Email)) {
		
			return;
		}
		var post = $http({
			method: "POST",
			url: "/Home/InsertCustomer",
			data: "{FirstName: '" + $scope.FirstName + "', LastName: '" + $scope.LastName + "', Email: '" + $scope.Email + "', PhoneNo: '" + $scope.PhoneNo + "', Status: '" + true + "'}",
			dataType: 'json',
			headers: { "Content-Type": "application/json" }
		});
		post.success(function (data, status) {
			//The newly inserted record is inserted into the array.
			$scope.Customers.push(data)
		});
		$scope.FirstName = "";
		$scope.LastName = "";
		$scope.Email = "";
		$scope.PhoneNo = "";
	};

	//This variable is used to store the original values.
	$scope.EditItem = {};

	//Editing an existing record.
	$scope.Edit = function (index) {
		//Setting EditMode to TRUE makes the TextBoxes visible for the row.
		$scope.Customers[index].EditMode = true;

		//The original values are saved in the variable to handle Cancel case.
		$scope.EditItem.FirstName = $scope.Customers[index].FirstName;
		$scope.EditItem.LastName = $scope.Customers[index].LastName;
		$scope.EditItem.Email = $scope.Customers[index].Email;
		$scope.EditItem.PhoneNo = $scope.Customers[index].PhoneNo;
		$scope.EditItem.Status = $scope.Customers[index].Status;
	};

	//Cancelling an Edit.
	$scope.Cancel = function (index) {
		// The original values are restored back into the Array.
		$scope.Customers[index].FirstName = $scope.EditItem.FirstName;
		$scope.Customers[index].LastName = $scope.EditItem.LastName;
		$scope.Customers[index].Email = $scope.EditItem.Email;
		$scope.Customers[index].PhoneNo = $scope.EditItem.PhoneNo;
		$scope.Customers[index].Status = $scope.EditItem.Status;
		//Setting EditMode to FALSE hides the TextBoxes for the row.
		$scope.Customers[index].EditMode = false;
		$scope.EditItem = {};
	};

	//Updating an existing record to database.
	$scope.Update = function (index) {
		var customer = $scope.Customers[index];
		var post = $http({
			method: "POST",
			url: "/Home/UpdateCustomer",
			data: '{customer:' + JSON.stringify(customer) + '}',
			dataType: 'json',
			headers: { "Content-Type": "application/json" }
		});
		post.success(function (data, status) {
			//Setting EditMode to FALSE hides the TextBoxes for the row.
			customer.EditMode = false;
		});
	};

	//Deleting an existing record from database.
	$scope.Delete = function (UserID) {
		if ($window.confirm("Do you want to delete this row?")) {
			var post = $http({
				method: "POST",
				url: "/Home/DeleteCustomer",
				data: "{UserID: " + UserID + "}",
				dataType: 'json',
				headers: { "Content-Type": "application/json" }
			});
			post.success(function (data, status) {
				//Remove the Deleted record from the Customers Array.
				$scope.Customers = $scope.Customers.filter(function (customer) {
					return customer.UserID !== UserID;
				});
			});
		}
	};
	// Below code is for filtering the records
	$scope.sortData = function (column) {
		$scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
		$scope.sortColumn = column;
	}
	// Below code is for sorting the records and show arrow.
	$scope.getSortClass = function (column) {
		if ($scope.sortColumn == column) {
			return $scope.reverseSort ? 'arrow-down' : 'arrow-up'
		}
		return '';
	}
});
// Validation for Phone No
function isNumberKey(evt) {
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	if (charCode != 46 && charCode > 31
		&& (charCode < 48 || charCode > 57))
		return false;
	
	return true;
}
// Validation for Email
function checkEmail(email) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		return (true);
		}
		alert("You have entered an invalid email address!")
		return (false);
	
}