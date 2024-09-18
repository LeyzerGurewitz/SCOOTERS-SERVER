const BASE_URL: string = "https://66e9434187e417609448b20d.mockapi.io/api/v1/scooters";
const formElement = document.querySelector("#form-main") as HTMLFormElement;
const tableElement = document.querySelector(".table") as HTMLTableElement;
const mainPage = document.querySelector(".container-home-page") as HTMLDivElement;
const editPage = document.querySelector(".edit") as HTMLDivElement;
const buttonSort = document.querySelector("#button-sort") as HTMLButtonElement;
const buttonFilter = document.querySelector("#button-filter") as HTMLButtonElement;

const saveToLocalStorage = (items: Scooter[]): void => {
    localStorage.setItem('scooter', JSON.stringify(items));
  };

  const loadFromLocalStorage = (): Scooter[] => {
    const storedItems = localStorage.getItem('scooter');
    return storedItems ? JSON.parse(storedItems):[];
  };

enum Status {
    available = "available",
    inRepair = "inRepair",
    unavailable = "unavailable"
}

interface Scooter {
    serialNumber: string;
    id?: string;
    model: string;
    batteryLevel: number;
    imageUrl: string;
    color: string;
    status: Status;
}


async function addScooter(scooter: Scooter): Promise<void> {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scooter)
        });

        if (!response.ok) {
            throw new Error("network error");
        }

        const newScooter: Scooter = await response.json();
        console.log(newScooter);
        const listScooter = loadFromLocalStorage()
        listScooter.push(newScooter)
        saveToLocalStorage(listScooter)

    } catch (error) {
        console.error(error);

    }
}


async function getAllScooter(): Promise<Scooter[]> {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch scooters");
        }
        const scooters: Scooter[] = await response.json();
        console.log(scooters);
        saveToLocalStorage(scooters)
        renderTable(scooters);
        return scooters;
    } catch (error) {
        console.error(error);
        return []; 
    }
}


async function editScooter(id: string, updatedScooter: Partial<Scooter>): Promise<void> {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedScooter)
        });

        if (!response.ok) {
            throw new Error("Failed to update scooter");
        }

        const updatedData: Scooter = await response.json();
        console.log("Scooter updated:", updatedData);
    } catch (error) {
        console.error(error);
    }
}


async function deleteScooterById(id: string): Promise<void> {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error("Failed to delete scooter");
        }

        console.log(`Scooter with ID ${id} was deleted successfully`);
    } catch (error) {
        console.error(error);
    }
}


const serialNumberTableCreate = (scooter: Scooter): HTMLTableCellElement => {
    const tdSerialNumber = document.createElement("td");
    tdSerialNumber.innerText = scooter.serialNumber;
    return tdSerialNumber;
}

const modelTableCreate = (scooter: Scooter): HTMLTableCellElement => {
    const tdModel = document.createElement("td");
    tdModel.innerText = scooter.model;
    return tdModel;
}

const batteryLevelTableCreate = (scooter: Scooter): HTMLTableCellElement => {
    const tdBatteryLevel = document.createElement("td");
    tdBatteryLevel.innerText = scooter.batteryLevel.toString();
    return tdBatteryLevel;
}

const imageUrlTableCreate = (scooter: Scooter): HTMLTableCellElement => {
    const tdImageUrl = document.createElement("td");
    const img = document.createElement("img");
    img.src = scooter.imageUrl;
    img.alt = scooter.model;
    img.width = 50; 
    tdImageUrl.appendChild(img);
    return tdImageUrl;
}

const statusTableCreate = (scooter: Scooter): HTMLTableCellElement => {
    const tdStatus = document.createElement("td");
    tdStatus.innerText = scooter.status;
    return tdStatus;
}

const colorTableCreate = (scooter: Scooter): HTMLTableCellElement => {
    const tdColor = document.createElement("td");
    tdColor.innerText = scooter.color;
    return tdColor;
}


const turnPageToEdit = () => {
    mainPage.classList.toggle("hidden"); 
    editPage.classList.toggle("visible");
}


const editCreate = (scooter: Scooter) => {
    const formEditElement = document.querySelector("#form-main-edit") as HTMLFormElement;
    
    
    (document.querySelector("#serial-number-edit") as HTMLInputElement).value = scooter.serialNumber;
    (document.querySelector("#model-edit") as HTMLInputElement).value = scooter.model;
    (document.querySelector("#battery-level-edit") as HTMLInputElement).value = scooter.batteryLevel.toString();
    (document.querySelector("#image-url-edit") as HTMLInputElement).value = scooter.imageUrl;
    (document.querySelector("#color-edit") as HTMLInputElement).value = scooter.color;
    (document.querySelector("#status-edit") as HTMLSelectElement).value = scooter.status;
 
    formEditElement.onsubmit = (e) => {
        e.preventDefault();

        if (!scooter.id) {
            console.error();
            return;
        }

        const updatedScooter: Partial<Scooter> = {
            serialNumber: (document.querySelector("#serial-number-edit") as HTMLInputElement).value,
            model: (document.querySelector("#model-edit") as HTMLInputElement).value,
            batteryLevel: +(document.querySelector("#battery-level-edit") as HTMLInputElement).value,
            imageUrl: (document.querySelector("#image-url-edit") as HTMLInputElement).value,
            color: (document.querySelector("#color-edit") as HTMLInputElement).value,
            status: (document.querySelector("#status-edit") as HTMLSelectElement).value as Status
        };

        editScooter(scooter.id, updatedScooter).then(() => {
            turnPageToEdit(); 
            getAllScooter();
        }).catch(error => {
            console.error("Error updating scooter:", error);
        });
    };
}


const clickEdit = (scooter: Scooter) => {
    turnPageToEdit();
    editCreate(scooter);
    
}


const actionsTableCreate = (scooter: Scooter): HTMLTableCellElement => {
    const tdActions = document.createElement("td");
    tdActions.setAttribute("id", "actions");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", () => {
        if (scooter.id) {
            deleteScooterById(scooter.id).then(() => getAllScooter());
        } else {
            console.error("Scooter ID is undefined");
        }
    });

    const updateBtn = document.createElement("button");
    updateBtn.innerText = "EDIT";
    updateBtn.addEventListener("click", () => clickEdit(scooter));

    tdActions.appendChild(deleteBtn);
    tdActions.appendChild(updateBtn);

    return tdActions;
}

const renderTable: (scooters: Scooter[]) => void = (scooters: Scooter[]) => {
    const rows = tableElement.querySelectorAll("tr");
    // localStorage.setItem("soldiers", JSON.stringify(scooters));
    rows.forEach((row, index) => {
        if (index > 0) {
            row.remove();
        }
    });

    if (!scooters.length){
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
}

const formSort = async () => {
    // const scooterList = await getAllScooter();
    const scootersLocal = loadFromLocalStorage()
    if (!scootersLocal) {
        console.error();
        return;
    }

    const option = (document.querySelector("#select-sort") as HTMLSelectElement).value;
    
    let sortedScooters: Scooter[] = [];

    switch(option){
        case "serialNumber":
            debugger
            sortedScooters = [...scootersLocal].sort((a: Scooter, b: Scooter) =>
                parseInt(a.serialNumber) - parseInt(b.serialNumber)
            );
            break;
        case "batteryLevel":
            sortedScooters = [...scootersLocal].sort((a:Scooter, b:Scooter) => b.batteryLevel - a.batteryLevel);
            break;
        case "model":
            sortedScooters = [...scootersLocal].sort((a:Scooter, b:Scooter) => a.model.localeCompare(b.model));
            break;
        default:
            sortedScooters = scootersLocal;
    }
    renderTable(sortedScooters);
}

const formFilter = async () => {
    
    const scootersLocal = loadFromLocalStorage()
    if (!scootersLocal) {
        console.error();
        return;
    }

    const option = (document.querySelector("#select-filter") as HTMLSelectElement).value;
    let inputFilter = (document.querySelector("#input-filter") as HTMLInputElement).value;
    let filterListScooters: Scooter[] = [];

    switch(option){
        case "serialNumber":
            debugger
            filterListScooters = scootersLocal.filter(scooter => scooter.serialNumber === inputFilter)         
            break;
        case "batteryLevel":
        filterListScooters = scootersLocal.filter(scooter => scooter.batteryLevel.toString() === inputFilter)
            break;
        case "model":
            filterListScooters = scootersLocal.filter(scooter => scooter.model === inputFilter)
            break;
        default:
            filterListScooters = scootersLocal;
    }
    renderTable(filterListScooters);
    inputFilter = ""
}

const clickButtonSubmit = (e: Event) => {
    e.preventDefault();

    const newScooter: Scooter = {
        serialNumber: (document.querySelector("#serial-number") as HTMLInputElement).value,
        model: (document.querySelector("#model") as HTMLInputElement).value,
        batteryLevel: +(document.querySelector("#battery-level") as HTMLInputElement).value,
        imageUrl: (document.querySelector("#image-url") as HTMLInputElement).value,
        color: (document.querySelector("#color") as HTMLInputElement).value,
        status: (document.querySelector("#status") as HTMLSelectElement).value as Status
    };

    addScooter(newScooter).then(() => {
        getAllScooter();
        formElement.reset();
    }).catch(error => {
        console.error("Error adding scooter:", error);
    });
}


getAllScooter();
formElement.addEventListener("submit", clickButtonSubmit);

buttonSort.addEventListener("click",  (event) => {
    event.preventDefault(); 
    formSort(); 
});

buttonFilter.addEventListener("click",(event) => {
    event.preventDefault();
    formFilter()
})