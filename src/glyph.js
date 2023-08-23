
/*
const Glyph = function(properties) {
    // Instantiate properties to default if they weren't passed
    properties = properties || {};
    this._char = properties['character'] || ' ';
    this._foreground = properties['foreground'] || 'white';
    this._background = properties['background'] || 'black';
};

// Create standard getters for glyphs
Glyph.prototype.getChar = function(){
    return this._char;
};

Glyph.prototype.getBackground = function(){
    return this._background;
};

Glyph.prototype.getForeground = function(){
    return this._foreground;
};

Glyph.prototype.getRepresentation = function() {
    return '%c{' + this._foreground + '}%b{' + this._background + '}' + this._char +
        '%c{white}%b{black}';
};*/

class Glyph {
    constructor(properties) {
        // Instantiate properties to default if they weren't passed
        properties = properties || {};
        this._char = properties['character'] || ' ';
        this._foreground = properties['foreground'] || 'white';
        this._background = properties['background'] || 'black';
    }

    // Create standard getters for glyphs
    getChar() {
        return this._char;
    }

    getBackground() {
        return this._background;
    }

    getForeground() {
        return this._foreground;
    }

    getRepresentation() {
        return '%c{' + this._foreground + '}%b{' + this._background + '}' + this._char +
            '%c{white}%b{black}';
    }
}

export default Glyph