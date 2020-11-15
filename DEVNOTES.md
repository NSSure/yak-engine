# Current tasks
- [x] Display the number of sprite being renderer within the fragments overlay
- [x] Render grid lines to the canvas
- [x] Add grid snapping for selection transform
- [x] Refactor hardcoded values into the main configuration file
- [x] Create editor-renderer.ts and move functionality for selection highlighting into this file (not the transform)
- [x] Refactor the sprite fragments array to remove the imageData being stored there have the sprite render from the tileset
- [ ] Add keyboard binding to cancel current pending sprite
- [x] Add the ability to toggle selection mode on and off
- [ ] Configure toolbar actions
	- [x] Stamp
		- [ ] Implement in renderer
	- [x] Selection
		- [ ] Implement in renderer
	- [x] Shape fill
		- [ ] Implement in renderer
	- [ ] Bucket fill
	- [-] Select same tile
		- [ ] When moving mouse slowly the highlighting does not work
	- [ ] Eraser
- [ ] Extend layer editing functionality
	- [x] Add a way to set the current layer for editor renderer
	- [x] Ensure the toolbar item actions apply to the current layer
	- [x] Seed test data with more than one layer
	- [x] Add the ability to lock layers
	- [x] Highlight current layer (LOOK INTO REFACTOR)
		- [x] Add layer opacity
	- [ ] Add the ability to re-order layers
	- [ ] Duplicate layer
- [ ] When in selection mode if the context menu is open any actions should apply to the selection area
	- [ ] Add bucket fill
	- [ ] Delete selection
	- [ ] Duplicate selection
	- [ ] Move selection
	- [ ] Move selection up
	- [ ] Move selection down
	- [ ] Move selection to back
	- [ ] Move selection to front
	- [ ] Flip selection by x
	- [ ] Flip selection by y


# Current bugs
- [ ] In selection mode when filling an area with sprites you can only go from top left to bottom right

# Need to be done at some point
- [ ] Add state manager overlay to enable browsing the current state
- [ ] Implement Sass for the default styles
- [ ] Ensure the load order works for all the other overlay positions