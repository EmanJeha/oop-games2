/* Questions for both games (Session 2: Methods). Edit text here; keep the structure. */
window.GAMES = {
 "warmup": {
  "badge": "Grade 10 · Unit 2 · Session 2 · Warm-up",
  "titleHTML": "<span class=\"c1\">P</span><span class=\"c2\">o</span><span class=\"c3\">w</span><span class=\"c4\">e</span><span class=\"c5\">r</span> <span class=\"c1\">B</span><span class=\"c2\">u</span><span class=\"c3\">t</span><span class=\"c4\">t</span><span class=\"c5\">o</span><span class=\"c1\">n</span><span class=\"c2\">s</span><span class=\"c3\">!</span>",
  "intro": "Everyday gadgets hide today’s mystery topic. Every correct answer flips two letters. Answer fast for bonus points and crack the topic for +200!",
  "rules": [
   "Play with your partner on one device",
   "Faster correct answers earn bonus points",
   "Each correct answer flips 2 letters",
   "Guess the topic early: +200",
   "Your score appears live on the smart board"
  ],
  "seconds": 40,
  "points": 100,
  "floaters": [
   "charge()",
   "jump()",
   "▶",
   "🔋",
   "📦",
   "unlock()",
   "( )",
   "= 1000"
  ],
  "mystery": {
   "label": "Today’s mystery topic",
   "phrase": "METHODS IN A CLASS",
   "order": [
    3,
    15,
    17,
    8,
    14,
    4,
    16,
    11,
    9,
    1,
    0,
    13,
    6,
    2,
    5
   ],
   "perCorrect": 2,
   "bonus": 200,
   "accept": [
    "methods in a class",
    "methods in class",
    "methods",
    "method",
    "class methods",
    "methods in classes",
    "a method",
    "methods of a class"
   ],
   "finalQ": "Put all the clues together. What is today’s topic?",
   "finalOptions": [
    "Loops in a List",
    "Methods in a Class",
    "Sorting Numbers",
    "If Statements"
   ],
   "finalAnswer": 1,
   "finalWhy": "Charging, unlocking, jumping and working out a volume are all ACTIONS an object can do. In a class these actions are called methods, like <code>volume()</code> for a box."
  },
  "questions": [
   {
    "type": "mc",
    "ctx": "Phone battery",
    "skill": "Analyze",
    "q": "Sara’s phone shows 40% battery. She plugs it in and later it shows 100%. Which statement BEST describes what happened?",
    "scene": "<span class=\"chip\" style=\"background:#FF4F8B\">battery = 40</span><span class=\"arrow\">→</span><span class=\"chip\" style=\"background:#14C3A2\">charge</span><span class=\"arrow\">→</span><span class=\"chip\" style=\"background:#3A86FF\">battery = 100</span>",
    "options": [
     "The phone’s brand changed",
     "Every phone in the world now has 100%",
     "An action the phone can do (charging) changed one of its own values",
     "The battery value can never change"
    ],
    "answer": 2,
    "why": "Charging is something the phone DOES. That action changed something the phone HAS: its battery went from 40 to 100. Actions that change an object’s own data are a big idea today."
   },
   {
    "type": "mc",
    "ctx": "TV remote",
    "skill": "Infer",
    "q": "Ali presses VOLUME UP on the remote for the living-room TV. There are 3 TVs in the house. What happens?",
    "options": [
     "Only the living-room TV gets louder",
     "All 3 TVs get louder",
     "Nothing, because remotes only change channels",
     "The TV in Ali’s room gets louder"
    ],
    "answer": 0,
    "why": "The button acts on ONE specific TV: the one it belongs to. Its volume changes; the other TVs keep their own volume. In Python, <code>self</code> is how an action knows which object it belongs to."
   },
   {
    "type": "mc",
    "ctx": "Vending machine",
    "skill": "Analyze",
    "q": "You press B3 on a vending machine. It works out the price, drops a juice and gives back your change. What does pressing a button do?",
    "options": [
     "It deletes the machine",
     "It changes the machine into a different machine",
     "It only turns the light on",
     "It runs an action that uses the machine’s own data and gives a result back"
    ],
    "answer": 3,
    "why": "Each button triggers a set of steps. The machine uses its own data (prices, stock) and hands a result back to you. That is exactly how a method works: it runs steps and can <b>return</b> a result."
   },
   {
    "type": "mc",
    "ctx": "Video game hero",
    "skill": "Classify",
    "q": "A game hero called Zed has health 80, speed 12 and a red cape. Zed can jump, attack and heal. Which list shows what Zed DOES?",
    "scene": "<span class=\"chip\" style=\"background:#FF4F8B\">health 80</span><span class=\"chip\" style=\"background:#FF9F1C\">speed 12</span><span class=\"chip\" style=\"background:#8F4DFF\">red cape</span><span class=\"chip\" style=\"background:#14C3A2\">jump</span><span class=\"chip\" style=\"background:#3A86FF\">attack</span><span class=\"chip\" style=\"background:#FFC233\">heal</span>",
    "options": [
     "health, speed, cape",
     "jump, attack, heal",
     "health, jump, cape",
     "Zed, 80, 12"
    ],
    "answer": 1,
    "why": "Health, speed and cape describe Zed: things he HAS (attributes). Jump, attack and heal are things he DOES. In a class, those actions are called methods."
   },
   {
    "type": "mc",
    "ctx": "Delivery box",
    "skill": "Apply",
    "q": "A delivery box is 10 cm long, 5 cm wide and 20 cm high. How much space is inside it?",
    "scene": "<span class=\"chip\" style=\"background:#FF4F8B\">length 10</span><span class=\"chip\" style=\"background:#3A86FF\">width 5</span><span class=\"chip\" style=\"background:#14C3A2\">height 20</span>",
    "options": [
     "35 cm³",
     "200 cm³",
     "1000 cm³",
     "10520 cm³"
    ],
    "answer": 2,
    "why": "Volume = length × width × height = 10 × 5 × 20 = 1000 cm³. That is exactly 1 litre, the size of a juice carton!"
   },
   {
    "type": "mc",
    "ctx": "Car keys",
    "skill": "Evaluate",
    "q": "Ali and Omar both own the same car model. Ali presses UNLOCK on his key. Why does ONLY Ali’s car open?",
    "options": [
     "Because the two cars are different models",
     "Because the action works on the car its key belongs to, not on every car of that model",
     "Because Omar’s car is broken",
     "Because only one car can be unlocked per day"
    ],
    "answer": 1,
    "why": "Both cars come from the same design and can do the same actions, but each action works on its own car. One design, many separate objects, each acting on itself."
   },
   {
    "type": "mc",
    "ctx": "Water bottle",
    "skill": "Infer",
    "q": "An app should tell you how much water is left in YOUR bottle. Which is the smartest design?",
    "options": [
     "Type the answer in by hand every time",
     "Make one number that every bottle shares",
     "Delete the bottle and buy a new one",
     "Give the bottle an action like how_much_left() that uses the bottle’s own size and level"
    ],
    "answer": 3,
    "why": "When the action lives inside the bottle and uses that bottle’s own data, every bottle can answer for itself. Write it once, use it for every bottle."
   },
   {
    "type": "mc",
    "ctx": "Spot the pattern",
    "skill": "Synthesize",
    "q": "What links charge, volume up, unlock, jump and how_much_left()?",
    "options": [
     "Each is an action an object can do, often using or changing its own data",
     "They are all types of numbers",
     "They are all colours",
     "They only work once"
    ],
    "answer": 0,
    "why": "Every one is an action that belongs to an object. In Python we write these actions inside a class with <code>def</code>. They are called <b>methods</b>."
   }
  ],
  "name": "Power Buttons!",
  "topic": "Methods in a Class",
  "recap": [
   [
    "Explain methods",
    "Actions an object can do"
   ],
   [
    "Define a method",
    "def volume(self): inside the class"
   ],
   [
    "Call a method",
    "p.volume() uses p’s own attributes"
   ]
  ]
 },
 "wrapup": {
  "badge": "Grade 10 · Unit 2 · Session 2 · Wrap-up",
  "titleHTML": "<span class=\"c1\">M</span><span class=\"c2\">e</span><span class=\"c3\">t</span><span class=\"c4\">h</span><span class=\"c5\">o</span><span class=\"c1\">d</span> <span class=\"c2\">M</span><span class=\"c3\">a</span><span class=\"c4\">s</span><span class=\"c5\">t</span><span class=\"c1\">e</span><span class=\"c2\">r</span><span class=\"c3\">s</span>",
  "intro": "Ten challenges on methods: define them, call them, return a result and use self. Prove you and your partner can make objects DO things!",
  "rules": [
   "Play with your partner on one device",
   "Faster correct answers earn bonus points",
   "Tap tiles to put steps in order",
   "Tap a code line to answer",
   "Your score appears live on the smart board"
  ],
  "seconds": 60,
  "points": 100,
  "floaters": [
   "def",
   "self",
   "return",
   ".volume()",
   "( )",
   "r1",
   "1000",
   "750"
  ],
  "questions": [
   {
    "type": "mc",
    "ctx": "Big idea",
    "skill": "Understand",
    "q": "Which sentence BEST describes a method?",
    "options": [
     "A variable that stores one number",
     "A function that belongs to a class and acts on the object’s attributes",
     "Another name for an object",
     "A file that saves your code"
    ],
    "answer": 1,
    "why": "A method is a function written inside a class. It describes a behaviour of the object and usually uses or changes its attributes through <code>self</code>."
   },
   {
    "type": "line",
    "ctx": "Read the code",
    "skill": "Analyze",
    "q": "Tap the line that DEFINES the method that works out the volume.",
    "code": [
     "class RectangularPrism:",
     "    def __init__(self, length, width, height):",
     "        self.length = length",
     "        self.width = width",
     "        self.height = height",
     "",
     "    def volume(self):",
     "        return self.length * self.width * self.height"
    ],
    "answer": 6,
    "why": "<code>def volume(self):</code> starts the method. The line under it does the work and returns the answer."
   },
   {
    "type": "line",
    "ctx": "Read the code",
    "skill": "Analyze",
    "q": "Tap the line that CALLS the method.",
    "code": [
     "rectangularprism_one = RectangularPrism(10, 5, 20)",
     "v1 = rectangularprism_one.volume()",
     "print(\"Volume:\", v1)"
    ],
    "answer": 1,
    "why": "Object name, a dot, the method name and brackets: <code>rectangularprism_one.volume()</code>. The first line creates the object; the last line prints the result."
   },
   {
    "type": "mc",
    "ctx": "Predict the output",
    "skill": "Predict",
    "q": "What does this program print?",
    "scene": "<pre class=\"mini\">r1 = RectangularPrism(10, 5, 15)\nprint(\"Volume:\", r1.volume())</pre>",
    "options": [
     "Volume: 30",
     "Volume: 10515",
     "Volume: 750",
     "Volume: r1.volume()"
    ],
    "answer": 2,
    "why": "<code>volume()</code> uses r1’s own attributes: 10 × 5 × 15 = 750."
   },
   {
    "type": "order",
    "ctx": "Behind the scenes",
    "skill": "Sequence",
    "wide": true,
    "q": "Put the steps in order: what happens when Python runs <code>v1 = p.volume()</code>?",
    "sub": "Tap the steps in the order they happen.",
    "tiles": [
     "Store 1000 in v1",
     "Find volume() in p’s class",
     "Multiply length × width × height",
     "self becomes p"
    ],
    "answer": [
     "Find volume() in p’s class",
     "self becomes p",
     "Multiply length × width × height",
     "Store 1000 in v1"
    ],
    "why": "Python looks up <code>volume()</code> in the RectangularPrism class, sets <code>self</code> to p, multiplies p’s own length, width and height, then returns 1000, which is stored in v1."
   },
   {
    "type": "mc",
    "ctx": "Debug it",
    "skill": "Evaluate",
    "q": "This method crashes when you call <code>p.volume()</code>. What is missing?",
    "scene": "<pre class=\"mini\">def volume():\n    return self.length * self.width * self.height</pre>",
    "options": [
     "<code>self</code> inside the brackets of <code>def volume()</code>",
     "A <code>print()</code> line",
     "A second class",
     "Quotation marks around the numbers"
    ],
    "answer": 0,
    "why": "Every method needs <code>self</code> as its first parameter. Python passes the object in automatically, so without <code>self</code> the method can’t reach the object’s length, width and height."
   },
   {
    "type": "mc",
    "ctx": "Return vs print",
    "skill": "Evaluate",
    "q": "Omar used <code>print</code> instead of <code>return</code>. After <code>v = p.volume()</code>, what is stored in <code>v</code>?",
    "scene": "<pre class=\"mini\">def volume(self):\n    print(self.length * self.width * self.height)\n\np = RectangularPrism(10, 5, 20)\nv = p.volume()</pre>",
    "options": [
     "1000",
     "\"1000\" as text",
     "An error stops the program",
     "None"
    ],
    "answer": 3,
    "why": "The method SHOWS 1000 on screen, but it doesn’t send anything back, so <code>v</code> is <code>None</code>. Use <code>return</code> when you want to keep and reuse the answer."
   },
   {
    "type": "mc",
    "ctx": "Challenge 1",
    "skill": "Compare",
    "q": "Which prism from Challenge 1 has the LARGEST volume?",
    "scene": "<span class=\"chip\" style=\"background:#FF4F8B\">r1 10×5×15</span><span class=\"chip\" style=\"background:#3A86FF\">r2 15×10×10</span><span class=\"chip\" style=\"background:#FF9F1C\">r3 4×8×9</span><span class=\"chip\" style=\"background:#14C3A2\">r4 20×4×5</span><span class=\"chip\" style=\"background:#8F4DFF\">r5 6×8×9</span>",
    "options": [
     "r1",
     "r4",
     "r2",
     "r5"
    ],
    "answer": 2,
    "why": "r1 = 750, r2 = 1500, r3 = 288, r4 = 400, r5 = 432. r2 wins with 1500. The same <code>volume()</code> method works for all five objects."
   },
   {
    "type": "mc",
    "ctx": "Real life",
    "skill": "Apply",
    "q": "You need to program a round WATER TANK. Which class and volume rule fit best?",
    "options": [
     "Cylinder · V = π × r² × h",
     "RectangularPrism · V = l × w × h",
     "TriangularPrism · V = ½ × b × h × l",
     "Phone · V = battery × storage"
    ],
    "answer": 0,
    "why": "A water tank is a cylinder, so its <code>volume()</code> method would return π × r² × h. A shipping box is a rectangular prism and a camping tent is a triangular prism."
   },
   {
    "type": "line",
    "ctx": "Find the bug",
    "skill": "Evaluate",
    "q": "After <code>my_phone.charge()</code> the battery still shows 40. Tap the line that causes the problem.",
    "code": [
     "class Phone:",
     "    def __init__(self, brand, battery):",
     "        self.brand = brand",
     "        self.battery = battery",
     "",
     "    def charge(self):",
     "        battery = 100",
     "",
     "my_phone = Phone(\"Samsung\", 40)",
     "my_phone.charge()",
     "print(my_phone.battery)"
    ],
    "answer": 6,
    "why": "<code>battery = 100</code> makes a new local variable that disappears when the method ends. To change the phone’s own battery, write <code>self.battery = 100</code>."
   }
  ],
  "name": "Method Masters",
  "topic": "Methods in a Class",
  "exitQ": "What is a method, and why does it need self? Use volume() as your example.",
  "exitPlaceholder": "A method is... It needs self because... For example volume()...",
  "exitModel": "A method is a function inside a class that describes what an object can do. It needs self so it can use that object’s own attributes. For example, volume() uses self.length, self.width and self.height, so p.volume() for a 10 × 5 × 20 box returns 1000."
 }
};
