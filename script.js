const scriptURL = "https://script.google.com/macros/s/AKfycby_FXEQWzl9QHeMmQojLxSbTZKHjqcWQrCDKmYVC5Nc21CV_2iMpodoxlcXUkgO36sa/exec"; // เปลี่ยนตรงนี้

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify({ action: "login", username, password }),
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem("username", username);
      localStorage.setItem("name", data.name);
      window.location = "dashboard.html";
    } else {
      document.getElementById("error").innerText = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
    }
  });
}

function loadProducts() {
  document.getElementById("currentUser").innerText = localStorage.getItem("name");

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify({ action: "getProducts" }),
  })
  .then(res => res.json())
  .then(data => {
    const table = document.querySelector("#productTable tbody");
    table.innerHTML = "";

    data.products.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p[0]}</td><td>${p[1]}</td><td>${p[2]}</td>
        <td><button class="btn btn-warning btn-sm" onclick="transact('withdraw', '${p[0]}', '${p[1]}')">เบิก</button></td>
        <td><button class="btn btn-primary btn-sm" onclick="transact('add', '${p[0]}', '${p[1]}')">เพิ่ม</button></td>
      `;
      table.appendChild(row);
    });
  });
}

function transact(action, product_id, product_name) {
  const qty = prompt("จำนวน:");
  if (!qty) return;
  const username = localStorage.getItem("username");

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify({
      action: "addTransaction",
      username, action,
      product_id,
      product_name,
      quantity: parseInt(qty)
    }),
  }).then(() => loadProducts());
}

function addProduct() {
  const id = document.getElementById("pid").value;
  const name = document.getElementById("pname").value;
  const stock = parseInt(document.getElementById("pstock").value);

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify({
      action: "addProduct",
      id, name, stock
    }),
  }).then(() => {
    document.getElementById("pid").value = "";
    document.getElementById("pname").value = "";
    document.getElementById("pstock").value = "";
    loadProducts();
  });
}
