# StarUMLJS

JavaScript code generation plugin for StarUML diagramming tool. 

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
