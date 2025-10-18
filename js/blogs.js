
        function toggleMenu() {
            const menu = document.querySelector('.menu-links');
            menu.classList.toggle('show');
            document.querySelector('.menu-icon').classList.toggle('change');
        }
        
        // NEW JAVASCRIPT FUNCTION TO SWITCH STYLESHEETS
        function switchStylesheet() {
            const currentStyle = document.getElementById('page-style');
            
            // Toggle between the original style and a hypothetical new style path
            if (currentStyle.getAttribute('href') === 'css/blogs.css') {
                currentStyle.setAttribute('href', 'css/blogs2.css');
                document.getElementById('style-switcher').textContent = 'With Css';
                console.log('Switched to css/blogs2.css');
            } else {
                currentStyle.setAttribute('href', 'css/blogs.css');
                document.getElementById('style-switcher').textContent = 'Pure HTML';
                console.log('Switched to css/blogs.css');
            }
        }
