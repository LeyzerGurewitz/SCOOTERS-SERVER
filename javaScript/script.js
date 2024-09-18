"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = "https://66e9434187e417609448b20d.mockapi.io/api/v1/scooters";
const formElement = document.querySelector("#form-main");
const tableElement = document.querySelector(".table");
const mainPage = document.querySelector(".container-home-page");
const editPage = document.querySelector(".edit");
const buttonSort = document.querySelector("#button-sort");
const buttonFilter = document.querySelector("#button-filter");
const saveToLocalStorage = (items) => {
    localStorage.setItem('scooter', JSON.stringify(items));
};
const loadFromLocalStorage = () => {
    const storedItems = localStorage.getItem('scooter');
    return storedItems ? JSON.parse(storedItems) : [];
};
var Status;
(function (Status) {
    Status["available"] = "available";
    Status["inRepair"] = "inRepair";
    Status["unavailable"] = "unavailable";
})(Status || (Status = {}));
function addScooter(scooter) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scooter)
            });
            if (!response.ok) {
                throw new Error("network error");
            }
            const newScooter = yield response.json();
            console.log(newScooter);
            const listScooter = loadFromLocalStorage();
            listScooter.push(newScooter);
            saveToLocalStorage(listScooter);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function getAllScooter() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(BASE_URL);
            if (!response.ok) {
                throw new Error("Failed to fetch scooters");
            }
            const scooters = yield response.json();
            console.log(scooters);
            saveToLocalStorage(scooters);
            renderTable(scooters);
            return scooters;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    });
}
function editScooter(id, updatedScooter) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedScooter)
            });
            if (!response.ok) {
                throw new Error("Failed to update scooter");
            }
            const updatedData = yield response.json();
            console.log("Scooter updated:", updatedData);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function deleteScooterById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${BASE_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error("Failed to delete scooter");
            }
            console.log(`Scooter with ID ${id} was deleted successfully`);
        }
        catch (error) {
            console.error(error);
        }
    });
}
const serialNumberTableCreate = (scooter) => {
    const tdSerialNumber = document.createElement("td");
    tdSerialNumber.innerText = scooter.serialNumber;
    return tdSerialNumber;
};
const modelTableCreate = (scooter) => {
    const tdModel = document.createElement("td");
    tdModel.innerText = scooter.model;
    return tdModel;
};
const batteryLevelTableCreate = (scooter) => {
    const tdBatteryLevel = document.createElement("td");
    tdBatteryLevel.innerText = scooter.batteryLevel.toString();
    return tdBatteryLevel;
};
const imageUrlTableCreate = (scooter) => {
    const tdImageUrl = document.createElement("td");
    const img = document.createElement("img");
    img.src = scooter.imageUrl;
    img.alt = scooter.model;
    img.width = 50;
    tdImageUrl.appendChild(img);
    return tdImageUrl;
};
const statusTableCreate = (scooter) => {
    const tdStatus = document.createElement("td");
    tdStatus.innerText = scooter.status;
    return tdStatus;
};
const colorTableCreate = (scooter) => {
    const tdColor = document.createElement("td");
    tdColor.innerText = scooter.color;
    return tdColor;
};
const turnPageToEdit = () => {
    mainPage.classList.toggle("hidden");
    editPage.classList.toggle("visible");
};
const editCreate = (scooter) => {
    const formEditElement = document.querySelector("#form-main-edit");
    document.querySelector("#serial-number-edit").value = scooter.serialNumber;
    document.querySelector("#model-edit").value = scooter.model;
    document.querySelector("#battery-level-edit").value = scooter.batteryLevel.toString();
    document.querySelector("#image-url-edit").value = scooter.imageUrl;
    document.querySelector("#color-edit").value = scooter.color;
    document.querySelector("#status-edit").value = scooter.status;
    formEditElement.onsubmit = (e) => {
        e.preventDefault();
        if (!scooter.id) {
            console.error();
            return;
        }
        const updatedScooter = {
            serialNumber: document.querySelector("#serial-number-edit").value,
            model: document.querySelector("#model-edit").value,
            batteryLevel: +document.querySelector("#battery-level-edit").value,
            imageUrl: document.querySelector("#image-url-edit").value,
            color: document.querySelector("#color-edit").value,
            status: document.querySelector("#status-edit").value
        };
        editScooter(scooter.id, updatedScooter).then(() => {
            turnPageToEdit();
            getAllScooter();
        }).catch(error => {
            console.error("Error updating scooter:", error);
        });
    };
};
const clickEdit = (scooter) => {
    turnPageToEdit();
    editCreate(scooter);
};
const actionsTableCreate = (scooter) => {
    const tdActions = document.createElement("td");
    tdActions.setAttribute("id", "actions");
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", () => {
        if (scooter.id) {
            deleteScooterById(scooter.id).then(() => getAllScooter());
        }
        else {
            console.error("Scooter ID is undefined");
        }
    });
    const updateBtn = document.createElement("button");
    updateBtn.innerText = "EDIT";
    updateBtn.addEventListener("click", () => clickEdit(scooter));
    tdActions.appendChild(deleteBtn);
    tdActions.appendChild(updateBtn);
    return tdActions;
};
const renderTable = (scooters) => {
    const rows = tableElement.querySelectorAll("tr");
    // localStorage.setItem("soldiers", JSON.stringify(scooters));
    rows.forEach((row, index) => {
        if (index > 0) {
            row.remove();
        }
    });
    if (!scooters.length) {
        console.error("No scooters found");
        return;
    }
    scooters.forEach(scooter => {
        const tr = document.createElement("tr");
        tr.appendChild(serialNumberTableCreate(scooter));
        tr.appendChild(modelTableCreate(scooter));
        tr.appendChild(batteryLevelTableCreate(scooter));
        tr.appendChild(imageUrlTableCreate(scooter));
        tr.appendChild(statusTableCreate(scooter));
        tr.appendChild(colorTableCreate(scooter));
        tr.appendChild(actionsTableCreate(scooter));
        tableElement.appendChild(tr);
    });
};
const formSort = () => __awaiter(void 0, void 0, void 0, function* () {
    // const scooterList = await getAllScooter();
    const scootersLocal = loadFromLocalStorage();
    if (!scootersLocal) {
        console.error();
        return;
    }
    const option = document.querySelector("#select-sort").value;
    let sortedScooters = [];
    switch (option) {
        case "serialNumber":
            debugger;
            sortedScooters = [...scootersLocal].sort((a, b) => parseInt(a.serialNumber) - parseInt(b.serialNumber));
            break;
        case "batteryLevel":
            sortedScooters = [...scootersLocal].sort((a, b) => b.batteryLevel - a.batteryLevel);
            break;
        case "model":
            sortedScooters = [...scootersLocal].sort((a, b) => a.model.localeCompare(b.model));
            break;
        default:
            sortedScooters = scootersLocal;
    }
    renderTable(sortedScooters);
});
const formFilter = () => __awaiter(void 0, void 0, void 0, function* () {
    const scootersLocal = loadFromLocalStorage();
    if (!scootersLocal) {
        console.error();
        return;
    }
    const option = document.querySelector("#select-filter").value;
    let inputFilter = document.querySelector("#input-filter").value;
    let filterListScooters = [];
    switch (option) {
        case "serialNumber":
            debugger;
            filterListScooters = scootersLocal.filter(scooter => scooter.serialNumber === inputFilter);
            break;
        case "batteryLevel":
            filterListScooters = scootersLocal.filter(scooter => scooter.batteryLevel.toString() === inputFilter);
            break;
        case "model":
            filterListScooters = scootersLocal.filter(scooter => scooter.model === inputFilter);
            break;
        default:
            filterListScooters = scootersLocal;
    }
    renderTable(filterListScooters);
    inputFilter = "";
});
const clickButtonSubmit = (e) => {
    e.preventDefault();
    const newScooter = {
        serialNumber: document.querySelector("#serial-number").value,
        model: document.querySelector("#model").value,
        batteryLevel: +document.querySelector("#battery-level").value,
        imageUrl: document.querySelector("#image-url").value,
        color: document.querySelector("#color").value,
        status: document.querySelector("#status").value
    };
    addScooter(newScooter).then(() => {
        getAllScooter();
        formElement.reset();
    }).catch(error => {
        console.error("Error adding scooter:", error);
    });
};
getAllScooter();
formElement.addEventListener("submit", clickButtonSubmit);
buttonSort.addEventListener("click", (event) => {
    event.preventDefault();
    formSort();
});
buttonFilter.addEventListener("click", (event) => {
    event.preventDefault();
    formFilter();
});
