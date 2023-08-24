
class Glyph {
    constructor(options) {
        // Instantiate properties to default if they weren't passed
        options = options || {};
        this._char = options['character'] || ' ';
        this._foreground = options['foreground'] || 'white';
        this._background = options['background'] || 'black';
        console.log(options)
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