// --- Dynamic Blog and Pagination Logic ---
const JSON_FILE_PATH = 'posts.json'; 
const POSTS_PER_PAGE = 6; // Set how many posts to show per page
let allPosts = [];
let currentPage = 1;

// Fetches data, sorts it, and initiates the first render
async function fetchAndRenderPosts() {
    const container = document.getElementById('blog-posts-container');
    container.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Loading blog posts...</p>'; 

    try {
        // 1. Fetch the data from the JSON file
        const response = await fetch(JSON_FILE_PATH);
        
        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
        }
        
        const rawPosts = await response.json();
        
        // 2. Sort Posts (Latest Date First)
        allPosts = rawPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 3. Render the initial state
        renderPage(currentPage);
        renderPagination();

    } catch (error) {
        console.error('CRITICAL: Error loading blog posts:', error);
        container.innerHTML = `
            <p style="color: red; text-align: center; grid-column: 1 / -1;">
                Error loading content. Please check if <code>${JSON_FILE_PATH}</code> is accessible.
            </p>
        `;
        document.getElementById('pagination-container').innerHTML = '';
    }
}

// Renders the cards for the current page number
function renderPage(pageNumber) {
    currentPage = pageNumber;
    const container = document.getElementById('blog-posts-container');
    container.innerHTML = ''; 

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const postsToShow = allPosts.slice(startIndex, endIndex);

    if (postsToShow.length === 0) {
        container.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">No posts found.</p>`;
        return;
    }

    // Create and append the cards
    postsToShow.forEach(post => {
        const postLink = document.createElement('a');
        postLink.href = post.url; 
        postLink.classList.add('blog-post-item');
        
        // **UPDATED HTML TEMPLATE to include the image**
        postLink.innerHTML = `
            <img 
                src="${post.imageUrl}" 
                alt="Cover image for ${post.title}" 
                class="blog-post-image"
                onerror="this.onerror=null; this.src='https://placehold.co/400x200/4a4a4a/ffffff?text=Image+Missing'"
            >
            <div>
                <p class="date">Published: ${post.date}</p>
                <h2>${post.title}</h2>
                <p class="summary">${post.summary}</p>
            </div>
            <span class="read-more-link">Read Full Article →</span>
        `;
        container.appendChild(postLink);
    });
    
    renderPagination();
}

// Creates and renders the pagination controls
function renderPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    
    if (allPosts.length <= POSTS_PER_PAGE) {
        paginationContainer.innerHTML = ''; 
        return;
    }

    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    paginationContainer.innerHTML = '';

    // --- Previous Button ---
    const prevButton = document.createElement('button');
    prevButton.textContent = '← Previous';
    prevButton.classList.add('pagination-btn');
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderPage(currentPage - 1);
    };
    paginationContainer.appendChild(prevButton);

    // --- Page Number Buttons ---
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('pagination-btn', 'pagination-page-number');
        
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        
        pageButton.onclick = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            renderPage(i);
        };
        paginationContainer.appendChild(pageButton);
    }

    // --- Next Button ---
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next →';
    nextButton.classList.add('pagination-btn');
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderPage(currentPage + 1);
    };
    paginationContainer.appendChild(nextButton);
}

document.addEventListener('DOMContentLoaded', fetchAndRenderPosts);
