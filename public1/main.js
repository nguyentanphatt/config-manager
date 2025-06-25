const API_URL = "http://localhost:3000/api";

let configData = [];
/**
 *
 * @param {*} data
 * @description
 * Render data to table
 * Add action for delete and update button
 */
function renderTable(data) {
  const tbody = document.querySelector("#configTable tbody");
  tbody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.classList.add("hover:bg-gray-100", "transition-colors", "duration-200");
    row.innerHTML = `
      <td class="border px-4 py-2 font-medium item-key">${item.key}</td>
      <td class="border px-4 py-2 whitespace-pre-wrap break-words max-w-2xl item-value">${
        item.value
      }</td>
      <td class="border px-4 py-2 align-top">
        ${
          item.editable
            ? `<div class="flex flex-col gap-2">
          <button class="editBtn w-[100px] py-2 px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-pointer">Edit</button>
          <button class="deleteBtn w-[100px] py-2 px-5 bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer">Delete</button>
        </div>`
            : ""
        }
      </td>
    `;

    const deleteBtn = row.querySelector(".deleteBtn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        const key = row.querySelector(".item-key").textContent;
        console.log(`Deleting key: ${key}`);

        fetch(`${API_URL}/config/delete/${encodeURIComponent(key)}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.ok) {
              row.remove();
            } else {
              throw new Error("Failed to delete item");
            }
          })
          .catch((err) => console.error(err));
      });
    }

    const editBtn = row.querySelector(".editBtn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        const valueCell = row.querySelector(".item-value");

        if (editBtn.textContent === "Edit") {
          const currentValue = valueCell.textContent;
          valueCell.innerHTML = `<input class="border px-2 py-1 w-full rounded" value="${currentValue}">`;
          editBtn.textContent = "Save";
          editBtn.classList.remove("bg-blue-500");
          editBtn.classList.add("bg-green-500");
        } else {
          const key = row.querySelector(".item-key").textContent;
          const newValue = valueCell.querySelector("input").value;

          fetch(`${API_URL}/config/update/${encodeURIComponent(key)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: newValue }),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Update failed");
              valueCell.innerHTML = newValue;
              editBtn.textContent = "Edit";
              editBtn.classList.remove("bg-green-500");
              editBtn.classList.add("bg-blue-500");
            })
            .catch(console.error);
        }
      });
    }

    tbody.appendChild(row);
  });
}

/**
 * @description
 * Call the api to render on table
 * Add option in select key in add form
 * Call search api
 */

fetch(`${API_URL}/config`)
  .then((res) => res.json())
  .then((data) => {
    configData = data;
    renderTable(configData);

    keySelect.innerHTML += configData
      .map((item) => `<option value="${item.key}">${item.key}</option>`)
      .join("");

    document.getElementById("searchInput").addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const search = async (searchTerm) => {
        const res = await fetch(`${API_URL}/config/${searchTerm}`);
        const data = await res.json();
        renderTable(data);
      };
      search(searchTerm);
    });
  })
  .catch((err) => console.error(err));

/**
 * @description
 * Action add, cancel and select key on add form
 */
document.getElementById("addButton").addEventListener("click", () => {
  document.getElementById("addModal").classList.remove("hidden");
});

document.getElementById("cancelAdd").addEventListener("click", () => {
  document.getElementById("addModal").classList.add("hidden");
  document.getElementById("formNew")?.reset();
  document.getElementById("formExtend")?.reset();
});

document.getElementById("keySelect").addEventListener("change", (e) => {
  const selectedKey = e.target.value;
  document.getElementById("addKey").value = selectedKey;
});

document.getElementById("formNew").addEventListener("submit", function (e) {
  e.preventDefault();
  const key = document.getElementById("addKey").value;
  const rawValue = document.getElementById("addValue").value;
  const type = document.getElementById("addType").value;
  let parsedValue;
  if (type === "") {
    alert("Please select type");
    return;
  } else if (type === "number") {
    parsedValue = Number(rawValue);
    if (isNaN(parsedValue)) {
      alert("Please enter a valid number");
      return;
    }
  } else if (type === "string") {
    parsedValue = rawValue;
  } else if (type === "array" || type === "object") {
    try {
      parsedValue = JSON.parse(rawValue);
      if (type === "array" && !Array.isArray(parsedValue)) {
        alert("Input is not a valid array");
        return;
      }
      if (
        type === "object" &&
        (typeof parsedValue !== "object" || Array.isArray(parsedValue))
      ) {
        alert("Input is not a valid object");
        return;
      }
    } catch (err) {
      alert("Invalid JSON format");
      return;
    }
  }

  fetch(`${API_URL}/config/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value: parsedValue }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to add item");
      return res.json();
    })
    .then(() => {
      document.getElementById("addModal").classList.add("hidden");
      document.getElementById("addForm").reset();
      return fetch(`${API_URL}/config`);
    });
});
