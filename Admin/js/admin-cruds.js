// Pagination constants
const MOVIES_PER_PAGE = 10;
let currentPage = 1;
let pageSnapshots = []; // Store last doc of each page

// Load danh sách movies
async function loadMovies(page = 1) {
  const productTableBody = document.getElementById("movies-list");
  let htmls = "";
  let index = (page - 1) * MOVIES_PER_PAGE + 1;

  let query = db.collection("movies-data").orderBy("createdAt", "desc").limit(MOVIES_PER_PAGE);

  // For pages after the first, use startAfter
  if (page > 1 && pageSnapshots[page - 2]) {
    query = query.startAfter(pageSnapshots[page - 2]);
  }

  try {
    const querySnapshot = await query.get();

    querySnapshot.forEach((doc) => {
      const movies = doc.data();
      htmls += `
        <tr>  
          <th scope="row" class="main__table-text">${index}</th>
          <td>
            <div class="main__table-text"><a href="#">${movies.name}</a></div>
          </td>
          <td>
            <div class="main__table-text">${movies.type}</div>
          </td>
          <td>
            <div class="main__table-text main__table-text--green">Visible</div>
          </td>
          <td>
            <div class="main__table-text">${movies.year}</div>
          </td>
          <td>
            <div class="main__table-btns">
              <a href="#modal-status" class="main__table-btn main__table-btn--banned open-modal">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,13a1.49,1.49,0,0,0-1,2.61V17a1,1,0,0,0,2,0V15.61A1.49,1.49,0,0,0,12,13Zm5-4V7A5,5,0,0,0,7,7V9a3,3,0,0,0-3,3v7a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V12A3,3,0,0,0,17,9ZM9,7a3,3,0,0,1,6,0V9H9Zm9,12a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1Z"/></svg>
              </a>
              <a href="#" class="main__table-btn main__table-btn--view">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z"/></svg>
              </a>
              <button class="main__table-btn main__table-btn--edit" data-id="${doc.id}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,7.24a1,1,0,0,0-.29-.71L17.47,2.29A1,1,0,0,0,16.76,2a1,1,0,0,0-.71.29L13.22,5.12h0L2.29,16.05a1,1,0,0,0-.29.71V21a1,1,0,0,0,1,1H7.24A1,1,0,0,0,8,21.71L18.87,10.78h0L21.71,8a1.19,1.19,0,0,0,.22-.33,1,1,0,0,0,0-.24.7.7,0,0,0,0-.14ZM6.83,20H4V17.17l9.93-9.93,2.83,2.83ZM18.17,8.66,15.34,5.83l1.42-1.41,2.82,2.82Z"/></svg>
              </button>
              <button class="main__table-btn main__table-btn--delete" data-id="${doc.id}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18ZM20,6H16V5a3,3,0,0,0-3-3H11A3,3,0,0,0,8,5V6H4A1,1,0,0,0,4,8H5V19a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V8h1a1,1,0,0,0,0-2ZM10,5a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V6H10Zm7,14a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V8H17Zm-3-1a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      index++;
    });

    productTableBody.innerHTML = htmls;

    // Save the last doc for pagination
    if (querySnapshot.docs.length > 0) {
      pageSnapshots[page - 1] = querySnapshot.docs[querySnapshot.docs.length - 1];
    }

    // Re-attach your edit/delete event listeners here
    document.querySelectorAll(".main__table-btn--edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const movieId = btn.getAttribute("data-id");
        localStorage.setItem("editingProductId", movieId);
        window.location.href = "add-item.html";
      });
    });

    document.querySelectorAll(".main__table-btn--delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const productId = btn.getAttribute("data-id");
        await deleteProduct(productId);
      });
    });

    // Render paginator
    renderPaginator(page);

  } catch (error) {
    console.error("Error fetching products: ", error);
  }
}

function renderPaginator(page) {
  const paginator = document.querySelector(".paginator__paginator");
  paginator.innerHTML = "";

  // For demo, show 5 pages. You can improve this by calculating total pages.
  for (let i = 1; i <= 5; i++) {
    paginator.innerHTML += `<li class="${i === page ? 'active' : ''}"><a href="#" data-page="${i}">${i}</a></li>`;
  }

  paginator.querySelectorAll("a[data-page]").forEach(a => {
    a.onclick = (e) => {
      e.preventDefault();
      currentPage = parseInt(a.getAttribute("data-page"));
      loadMovies(currentPage);
    };
  });
}

// Xóa sản phẩm
async function deleteProduct(productId) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
    try {
      await db.collection("movies-data").doc(productId).delete();
      console.log("Product successfully deleted!");
      await loadMovies(); // Tải lại danh sách sản phẩm
    } catch (error) {
      console.error("Error removing product: ", error);
    }
  }
}

// Khởi chạy loadMovies khi mở trang
loadMovies(currentPage);

// logout function
const logout_btn = document.getElementById("logout_btn");

if (logout_btn) {
  logout_btn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    alert("You have been logged out!");
    location.href = "../Sliding Login Form.html"; // redirect to login page
  });
}

document.addEventListener("DOMContentLoaded", function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      const sidebarUsername = document.getElementById("sidebar-username");
      if (sidebarUsername) {
        sidebarUsername.textContent = user.username;
      }
    }
  });
});