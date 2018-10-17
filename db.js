const spicedPg = require('spiced-pg');
const secrets = require('./secrets.json')
dbUrl = secrets.dbUrl;

const db = spicedPg(dbUrl);

exports.getTables = () => {
    const q =
    `
    SELECT * FROM images
    ORDER BY id DESC
    LIMIT 8
    `;
    return db.query(q);
};

exports.getImageInfo = (id) => {
    const q =
    `
    SELECT *
    FROM images
    WHERE id = ($1)
    `;
    return db.query(q, [id]);
};

exports.writeFileTo = (url, title, description, username) => {
    const q =
    `
    INSERT INTO images (url, title, description, username)
    VALUES ($1, $2, $3, $4)
    RETURNING url, title, id
    `;
    return db.query(q, [url || null, title || null, description || null, username || null])
};

exports.insertComments = (id, comment, username) => {
    const q =
    `
    INSERT INTO comments (image_id, comment, username)
    VALUES ($1, $2, $3)
    RETURNING comment, username, created_at
    `;
    return db.query(q, [id, comment, username]);
};

exports.selectComments = image_id => {
    const q =
    `
    SELECT comment, username, created_at
    FROM comments
    WHERE image_id = ($1)
    ORDER BY id DESC
    `;
    return db.query(q, [image_id]);
};

exports.getMoreImages = (id) => {
    const q =
    `
    SELECT * FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 10
    `;
    return db.query(q, [id]);
}
