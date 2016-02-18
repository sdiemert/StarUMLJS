# StarUMLJS

JavaScript code generation plugin for StarUML diagramming tool.

## Installation
There are several ways to install an extension into StarUML.

### StarUML Extension Repository

StarUMLJS is part of the StarUML offical extension repository. Open the extension manager (Tools -> Extension Manager) and install the JavaScript extension.

### Via URL
Note, installing from GitHub will give whatever is at the HEAD of the master branch. This is not guarenteed to be stable.

* Open the StarUML extension manager (Tools -> Extension Manager).
* In the bottom left corner of the pop window select "Install from URL"
* Enter the following URL: [https://github.com/sdiemert/StarUMLJS](https://github.com/sdiemert/StarUMLJS)
* You may have to reload StarUML or just restart to the application.

## Current Status

* Currently supports one way generation of JS code from a UML model.
* Uses the standard prototype JS definition of a "class"

### Supported UML Concepts

* The tool currently supports a subset of the StarUML model:

    * Classes
    * Methods of classes (all treated as public)
    * Attributes of classes
    * Class Documentation
    * Method Documentation
    * Method Specification
    * Method Precondition
    * Method Postcondition
    * Method Parameters
    * Dependencies
    * Direct Association
    * Generalization


## Developers

* Please contribute, this project is by no means complete and is currently not stable.
* Open dev tasks are:
    * Reverse code engineering
    * Other "class" definition styles
    * More advanced UML concept support

### Useful Links

* StarUML application page:  [http://staruml.io/](http://staruml.io/)
* StarUML extension developer guide: [https://github.com/staruml/staruml-dev-docs/wiki](https://github.com/staruml/staruml-dev-docs/wiki)
