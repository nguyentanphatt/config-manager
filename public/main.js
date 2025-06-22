const API_URL = "http://localhost:3000/api";

let configData = [];

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

fetch(`${API_URL}/config`)
  .then((res) => res.json())
  .then((data) => {
    configData = data;
    renderTable(configData);

    document.getElementById("searchInput").addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = configData.filter((item) =>
        item.key.toLowerCase().includes(searchTerm)
      );
      renderTable(filtered);
    });
  })
  .catch((err) => console.error(err));
