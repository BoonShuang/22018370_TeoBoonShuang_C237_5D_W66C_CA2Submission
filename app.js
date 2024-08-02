const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const { getProductTypeColor } = require('./colors'); // Import getProductTypeColor

const app = express();

// Set up session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));


// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'mysql-boonshuang.alwaysdata.net',
    user: '371279',
    password: 'Cc5s@HrV8!.KuFN',
    database: 'boonshuang_skincare_app_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Assuming db is your database connection
function usernameExists(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';
        skincare_app_db.query(sql, [username], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0].count > 0);
            }
        });
    });
}


// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Enable static files
app.use(express.static('public'));

// Enable form processing
app.use(express.urlencoded({ extended: false }));

// Fetch distinct brands from the database
function fetchBrands(callback) {
    const sql = 'SELECT DISTINCT brand FROM skincare_product';
    connection.query(sql, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        const brands = results.map(row => row.brand);
        callback(null, brands);
    });
}

// Define routes
app.get('/', (req, res) => {
    let sql = 'SELECT * FROM skincare_product';
    const filters = [];

    if (req.query.brand) {
        filters.push(`brand = '${req.query.brand}'`);
    }
    if (req.query.productType) {
        filters.push(`productType = '${req.query.productType}'`);
    }
    if (req.query.rating) {
        const [min, max] = req.query.rating.split('-');
        filters.push(`averageRating BETWEEN ${min} AND ${max}`);
    }

    if (filters.length > 0) {
        sql += ' WHERE ' + filters.join(' AND ');
    }

    if (!req.session) {
        return res.status(500).send('Session not initialized');
    }

    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving skincare products');
        }

        // Map product types to colors
        results.forEach(product => {
            product.badgeColor = getProductTypeColor(product.productType);
        });

        fetchBrands((error, brands) => {
            if (error) {
                console.error('Error fetching brands:', error.message);
                return res.status(500).send('Error retrieving brands');
            }

            const noMatchingProducts = filters.length > 0 && results.length === 0;

            // Check if a user is logged in
            const username = req.session.username;
            const userQuery = 'SELECT username FROM users WHERE loggedIn = 1 AND username = ?';

            connection.query(userQuery, [username], (userError, userResults) => {
                if (userError) {
                    console.error('Database query error:', userError.message);
                    return res.status(500).send('Error retrieving user information');
                }

                const loggedInUsername = userResults.length > 0 ? userResults[0].username : null;

                res.render('index', {
                    skincare_product: results,
                    skincare_brands: brands,
                    getProductTypeColor,
                    noMatchingProducts,
                    username: loggedInUsername
                });
            });
        });
    });
});

app.get('/skincare_product/:id', (req, res) => {
    const productID = req.params.id;
    const sql = 'SELECT * FROM skincare_product WHERE productID = ?';

    connection.query(sql, [productID], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving product details');
        }

        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }

        // Map product type to color
        const product = results[0];
        product.badgeColor = getProductTypeColor(product.productType);

        res.render('product', { skincare_product: product, getProductTypeColor: getProductTypeColor }); // Pass getProductTypeColor to product.ejs
    });
});

app.get('/addProduct', (req, res) => {
    res.render('addProduct');
});

app.post('/addProduct', upload.single('image'), (req, res) => {
    const { brand, productName, description, productType, averageRating } = req.body;
    const image = req.file.filename;

    const sql = 'INSERT INTO skincare_product (brand, productName, description, productType, averageRating, image) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [brand, productName, description, productType, averageRating, image], (error, results) => {
        if (error) {
            console.error('Database insertion error:', error.message);
            return res.status(500).send('Error adding new product');
        }
        res.redirect('/');
    });
});

app.get('/editProduct/:id', (req, res) => {
    const productID = req.params.id;
    const sql = 'SELECT * FROM skincare_product WHERE productID = ?';

    connection.query(sql, [productID], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving product details');
        }

        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }

        // Map product type to color
        const product = results[0];
        product.badgeColor = getProductTypeColor(product.productType);

        res.render('editProduct', { skincare_product: product });
    });
});

app.post('/editProduct/:id', upload.single('image'), (req, res) => {
    const productID = req.params.id;
    const { brand, productName, description, productType } = req.body;
    let image = req.body.currentImage; // Default to current image

    if (req.file) {
        image = req.file.filename; // Use new image if uploaded
    }

    const sql = 'UPDATE skincare_product SET brand = ?, productName = ?, description = ?, image = ?, productType = ? WHERE productID = ?';

    connection.query(sql, [brand, productName, description, image, productType, productID], (error, result) => {
        if (error) {
            console.error('Error updating product:', error.message);
            return res.status(500).send('Error updating product');
        }

        res.redirect('/');
    });
});

app.get('/deleteProduct/:id', (req, res) => {
    const productID = req.params.id;
    const sql = 'DELETE FROM skincare_product WHERE productID = ?';

    connection.query(sql, [productID], (error, result) => {
        if (error) {
            console.error('Error deleting product:', error);
            return res.status(500).send('Error deleting product');
        }

        res.redirect('/');
    });
});

app.get('/loginPage', (req, res) => {
    res.render('loginPage'); 
});



//  /login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(query, [username, password], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.redirect('/loginPage?error=serverError');
        } else if (results.length > 0) {
            req.session.username = username;
            req.session.loggedIn = true;

            const updateQuery = 'UPDATE users SET loggedIn = 1 WHERE username = ?';
            connection.query(updateQuery, [username], (updateError) => {
                if (updateError) {
                    console.error('Error updating loggedIn status:', updateError.message);
                }
            });

            res.redirect('/');
        } else {
            res.redirect('/loginPage?error=invalidCredentials');
        }
    });
});

//  /logout route
app.get('/logout', (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.redirect('/');
    }

    const updateSql = 'UPDATE users SET loggedIn = 0 WHERE username = ?';
    connection.query(updateSql, [username], (updateError) => {
        if (updateError) {
            console.error('Error updating user status:', updateError.message);
            return res.status(500).send('Error logging out');
        }

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error logging out');
            }
            res.redirect('/');
        });
    });
});



// Define the user profile route
app.get('/customerProfile', (req, res) => {
    const username = req.session.username;

    if (!username) {
        return res.redirect('/loginPage');
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving user profile');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        res.render('customerProfile', { user: results[0], username: username }); // Pass results[0] as 'user' and 'username'
    });
});

app.get('/registerPage', (req, res) => {
    res.render('registerPage');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validate username and password length
    if (username.length > 100) {
        return res.redirect('/registerPage?error=invalidUsername');
    } else if (password.length > 20) {
        return res.redirect('/registerPage?error=invalidPassword');
    }

    // Check if username already exists
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.redirect('/registerPage?error=serverError');
        }

        if (results.length > 0) {
            return res.redirect('/registerPage?error=usernameTaken');
        }

        // Insert new user into the database
        const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
        connection.query(insertQuery, [username, password], (insertError) => {
            if (insertError) {
                console.error('Database insertion error:', insertError.message);
                return res.redirect('/registerPage?error=serverError');
            }

            res.redirect('/loginPage');
        });
    });
});

// Route to render editCustomerProfile.ejs
app.get('/editCustomerProfile', (req, res) => {
    const { username } = req.session;
    if (!username) {
        return res.redirect('/login'); // Redirect if not logged in
    }
    const sql = 'SELECT * FROM users WHERE username = ?';
    connection.query(sql, [username], (error, results) => {
        if (error) {
            console.error('Error fetching user details:', error.message);
            return res.status(500).send('Error fetching user details');
        }
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        const user = results[0];
        res.render('editCustomerProfile', { user, username, errorMessage: null }); // Initialize errorMessage as null
    });
});

// Update profile route
app.post('/updateProfile', (req, res) => {
    const { username, password } = req.body;

    // Validation checks
    if (!username || !password) {
        return res.render('editCustomerProfile', {
            errorMessage: 'Username and password are required.',
            user: { username, password }
        });
    }

    // Check if username already exists
    const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
    connection.query(checkUsernameQuery, [username], (error, results) => {
        if (error) {
            console.error('Error checking username:', error.message);
            return res.status(500).send('Error checking username');
        }

        if (results.length > 0 && results[0].username !== req.session.username) {
            // Username already exists and it's not the current user's username
            return res.render('editCustomerProfile', {
                errorMessage: 'Username already exists. Please choose a different username.',
                user: { username, password }
            });
        }

        // Update the profile with the new username and password
        const updateProfileQuery = 'UPDATE users SET username = ?, password = ? WHERE username = ?';
        connection.query(updateProfileQuery, [username, password, req.session.username], (updateError, result) => {
            if (updateError) {
                console.error('Error updating user profile:', updateError.message);
                return res.render('editCustomerProfile', {
                    errorMessage: 'Error updating user profile. Please try again later.',
                    user: { username, password }
                });
            }

            // Update session with new username
            req.session.username = username;

            res.redirect('/customerProfile');
        });
    });
});

// Delete user route
app.get('/deleteUser', (req, res) => {
    const { username } = req.session;
    if (!username) {
        return res.redirect('/login'); // Redirect if not logged in
    }

    const deleteUserQuery = 'DELETE FROM users WHERE username = ?';
    connection.query(deleteUserQuery, [username], (error, result) => {
        if (error) {
            console.error('Error deleting user:', error.message);
            return res.status(500).send('Error deleting user');
        }

        // Destroy the session and redirect to the homepage
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Error logging out');
            }

            res.redirect('/');
        });
    });
});





// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


