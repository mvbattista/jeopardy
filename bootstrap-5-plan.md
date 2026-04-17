# Bootstrap 3.3.5 → 5.3.x Upgrade Plan

## Context
Bootstrap 3.3.5 (2014) is unsupported and has known security/compatibility issues. The app uses a heavy custom dark/navy Jeopardy theme that overrides most Bootstrap default styles, which significantly reduces visual impact risk. The main work is adapting to renamed/removed classes, new HTML data attributes, and Bootstrap 5's JavaScript API (which dropped jQuery plugins).

## Strategy
- Add Bootstrap 5.3.x files alongside existing 3.3.5 files (non-destructive, allows easy rollback)
- Write a tiny jQuery modal shim so `jeopardy.js`, `jeopardy-host.js`, and `creator.js` need **zero changes**
- Migrate renamed HTML classes and `data-*` attributes
- Update CSS selectors that reference Bootstrap class names

---

## Step 1: Download Bootstrap 5.3.x Static Files
Create `bootstrap-static/5.3.x/css/bootstrap.min.css` and `bootstrap-static/5.3.x/js/bootstrap.bundle.min.js` (the bundle includes Popper.js — no separate file needed).

Source files from: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/`

---

## Step 2: Create jQuery Modal Shim
**New file:** `js/bootstrap5-modal-compat.js`

This bridges existing `$('#id').modal('show/hide/toggle')` calls to Bootstrap 5's `bootstrap.Modal` API, so the three app JS files need no changes at all:

```javascript
$.fn.modal = function(action) {
    return this.each(function() {
        let instance = bootstrap.Modal.getInstance(this) || new bootstrap.Modal(this);
        if (action === 'show') instance.show();
        else if (action === 'hide') instance.hide();
        else if (action === 'toggle') instance.toggle();
        else if (action === 'dispose') instance.dispose();
    });
};
```

---

## Step 3: Update `index.html`
**File:** `/Users/mbatt0909/Documents/Github/mvbattista/jeopardy/index.html`

### Asset links (head)
- Replace `3.3.5/css/bootstrap.min.css` → `5.3.x/css/bootstrap.min.css`
- **Remove** `bootstrap-theme.min.css` line (does not exist in v5)
- Add Bootstrap Icons CDN: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">`
- Replace `3.3.5/js/bootstrap.min.js` → `5.3.x/js/bootstrap.bundle.min.js`
- Add `<script src="./js/bootstrap5-modal-compat.js">` after Bootstrap JS, before `jeopardy.js`

### Class renames (body)
| Old | New |
|-----|-----|
| `panel panel-default` | `card` |
| `panel-heading` | `card-header` |
| `panel-body` | `card-body` |
| `panel-footer` | `card-footer` |
| `pull-right` | `float-end` |
| `col-md-offset-4` | `offset-md-4` |
| `radio-inline` | `form-check-inline` |
| `glyphicon glyphicon-ok` | `bi bi-check-lg` |
| `glyphicon glyphicon-remove` | `bi bi-x-lg` |

### Data attribute renames (critical — controls modal behavior)
| Old | New |
|-----|-----|
| `data-backdrop="static"` | `data-bs-backdrop="static"` |
| `data-keyboard="false"` | `data-bs-keyboard="false"` |
| `data-dismiss="modal"` | `data-bs-dismiss="modal"` |

The `data-bs-backdrop` and `data-bs-keyboard` changes are **functionally critical**: without them, the question/daily double/game-load modals become dismissible by clicking outside, breaking gameplay.

---

## Step 4: Update `host.html`
**File:** `/Users/mbatt0909/Documents/Github/mvbattista/jeopardy/host.html`

Same changes as `index.html`:
- Asset link replacements
- Add Bootstrap Icons CDN
- Add compat shim (loaded before `jeopardy-host.js`)
- All class renames and data attribute renames (identical structure to index.html)

---

## Step 5: Update `creator/index.html`
**File:** `/Users/mbatt0909/Documents/Github/mvbattista/jeopardy/creator/index.html`

### Asset links
- Replace `../bootstrap-static/3.3.5/css/bootstrap.min.css` → `../bootstrap-static/5.3.x/css/bootstrap.min.css`
- **Remove** `bootstrap-theme.min.css` line
- Replace `3.3.5/js/bootstrap.min.js` → `5.3.x/js/bootstrap.bundle.min.js`
- Add compat shim before `creator.js`

### Class renames
| Old | New |
|-----|-----|
| `close` (button class) | `btn-close` |
| `pull-left` | `float-start` |
| `col-xs-6` | `col-6` |

### Data attribute renames
- `data-dismiss="modal"` → `data-bs-dismiss="modal"` (2 occurrences: close button + "Save & Close" button)

### Close button restructure
Bootstrap 5 replaces the styled `×` close button with a CSS-rendered `btn-close`:
```html
<!-- Old -->
<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:white; opacity:0.7;">&times;</button>

<!-- New -->
<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
```

---

## Step 6: Update `css/jeopardy.css`
**File:** `/Users/mbatt0909/Documents/Github/mvbattista/jeopardy/css/jeopardy.css`

- `.panel-footer` selector → `.card-footer` (line 78–81)
- The `.well` rule can remain — it is an unused custom class after the migration (no HTML references it), but it causes no harm

---

## Step 7: Update `css/creator.css`
**File:** `/Users/mbatt0909/Documents/Github/mvbattista/jeopardy/css/creator.css`

Scan for any selectors referencing Bootstrap 3 class names (`.panel-*`, `.pull-*`, `.well`, etc.) and update to Bootstrap 5 equivalents. This file uses largely custom classes, so changes here are likely minimal.

---

## Verification
1. Open `index.html` in a browser — confirm dark navy background, white text, and score footer are intact
2. Load a `.json` game file — verify the load modal opens, then hides after loading
3. Click a question tile — verify the full-screen question modal opens with correct content; clicking score buttons closes it
4. Click "Adjust Scores" — verify the score-adjust modal opens and "Save and Close" dismisses it
5. Navigate to Final Jeopardy — confirm daily double wager modal, final jeopardy modal work correctly
6. Open `creator/index.html` — verify the board renders; click a tile to confirm the edit modal opens and both the ✕ close button and "Save & Close" button dismiss it
7. Verify ✓ and ✗ icons appear on score buttons (Bootstrap Icons)
