# touch-controls
A-Frame component to handle the Oculus Rift Touch Controlers

# Installing

```
npm install
npm run start //to launch the web server
```

# Usage
To use this component just add the touch-controls library to your page, and add an entity component for each hand.

```html
<html>
  <head>
    <script src="https://aframe.io/releases/0.3.2/aframe.js"></script>
    <script src="touch-controls.js"></script>
  </head>
  <body>
    <a-scene>
      <a-entity touch-controls="hand: left"></a-entity>
      <a-entity touch-controls="hand: right"></a-entity>

      <!-- Your code here -->
    </a-scene>
  </body>
</html>
```