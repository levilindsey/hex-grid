#### Character-by-character animation of text

This text-animation package makes it easy to animate the text of any collection of HTML elements. With this package,
each character animates individually, and it is simple to customize this animation.

This package is available in the Bower registry as [`text-animation`][bower-url].

### The In-Order Animation Algorithm

1. Iterate through each descendant node in the root element's DOM structure  
  a. This uses a pre-order tree traversal
  b. Store the text of each text node along with the parent element and next sibling node
     associated with the text node
  c. Fix each descendant element with its original dimensions
  d. Empty out all text nodes
2. Iterate through each character and animate them  
  a. This is now a simple linear iteration, because we flattened the DOM structure in our 
     earlier traversal  
  b. Animate the character  
    1. Add the character to a span  
    2. Insert the span into the character's parent element  
      a. If the original text node has a next sibling node, then insert this span before that node  
      b. Otherwise, append this node to the end of the original text node's parent node  
    4. Run the actual animation of the isolated character  
  c. Finish animating the character  
    1. Remove the span  
    2. Concatenate the character back into the original text node  

The following three representations of the same DOM structure may help to understand 
how this algorithm flattens and stores the DOM representation.

#### Original HTML Representation

    <body>
      H
      <p>
        e
      </p>
      y
      <div>
        D
        <p>
          O
        </p>
        M
      </div>
      !
    </body>

#### Visual Tree Representation

                                   <body>:Element
          ________________________________|________________________________
         /                /               |               \                \
    H:TextNode      <p>:Element      y:TextNode      <div>:Element      !:TextNode
                         |                  _______________|_______________
                     e:TextNode            /               |               \
                                      D:TextNode      <p>:Element      M:TextNode
                                                           |
                                                       O:TextNode

#### JavaScript Object Structure of Text Nodes

    [
      {"parentElement": <body>, "nextSiblingNode": <p>,   "text": "H"},
      {"parentElement": <p>,    "nextSiblingNode": null,  "text": "e"},
      {"parentElement": <body>, "nextSiblingNode": <div>, "text": "y"},
      {"parentElement": <div>,  "nextSiblingNode": <p>,   "text": "D"},
      {"parentElement": <p>,    "nextSiblingNode": null,  "text": "O"},
      {"parentElement": <div>,  "nextSiblingNode": null,  "text": "M"},
      {"parentElement": <body>, "nextSiblingNode": null,  "text": "!"}
    ]


[main-url]: http://levi.sl/text-animation
[codepen-url]: http://codepen.io/levisl176/full/HGJdF
[bower-url]: http://bower.io/search/?q=text-animation