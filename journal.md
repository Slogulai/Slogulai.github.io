# Chris Sloggetts Journal

This journal reflects the process of development that I took to create this project. I decided
to break this project down into the physical things that I would be creating and designing and the 
sections below illustrate my thought process with the project overall and the order at which I completed
the project. 

## File Structure
The begining of this project started with me wanting a clear file structure that I could easily follow. 
I did not want to crowd the root file structure with a bunch of photos, html, css and javascript, so I 
decided to make a clear and concise file structure that reflects what is held within each folder. While this
file structure is now large, the folders were my original intention. The file hierarchy is like such:
```plaintext
.
├── README.md
├── about
│   ├── about.html
│   └── about.js
├── assets
│   ├── 4runner-fortstevens.jpeg
│   ├── Microsoft-Fluentui-Emoji-3d-Water-Wave-3d.svg
│   ├── andresgrace-day.jpeg
│   ├── brokenoar-waldolake.jpeg
│   ├── chris-boat-pirate.jpeg
│   ├── chris-charlenabrie.jpeg
│   ├── chris-peteriredale.jpeg
│   ├── chris-snowmthood.jpeg
│   ├── chris-snowsurf.jpeg
│   ├── chris-spirit.jpeg
│   ├── chris-surfdiamondhead.jpg
│   ├── chrisandbroken-waldolake.jpeg
│   ├── chrisandcharlesportland.jpeg
│   ├── chrisandcharlestunnelfalls.jpeg
│   ├── chrisandjeff-fishing.jpeg
│   ├── chrisandjess-freds.jpeg
│   ├── chrisandjonah-mtsthelens.jpeg
│   ├── chrisandmisskitty.jpeg
│   ├── chrissloggett.png
│   ├── mtsthelens.jpeg
│   ├── schrunchyem.png
│   └── spirit-california.jpeg
├── contact
│   ├── contact.html
│   └── contact.js
├── index.html
├── journal
│   └── journal.md
├── navbar
│   ├── navbar.html
│   └── navbar.js
├── previous-work
│   ├── Chris Sloggett Resume.pdf
│   ├── previous-work.html
│   └── previous-work.js
├── projects
│   ├── projects.html
│   └── projects.js
└── styles.css
```    
Given the number of files that I have in assets alone, this file structure greatly helped me with keeping
the project organized and my thoughts on what needed to be completed next.

## Home Page
The home page was my obvious first choice in creating this project since it is where a user will land 
whenever they come to my website! I decided to use one of our original assignments for this and one 
of my favorite pictures of myself. The text on the page has changed a couple of times and will change
beyond this commit for this journal as well. Next, I began working on the navbar.


## Navbar
A stylized navbar that is responsive on cell phones was something that I wanted from the get go. I wanted
this navbar to be present on every web page and I didnt want to just have a singular web page for this project. 
After some searching around, I did find a simple navbar that looked good online, of which is referenced in my 
readme.md file. I layed this navbar out into the html of the home page and loved the look, the thing was, I 
didnt know how to, yet, get the navbar to be present on every page. After some more research I found that 
I could use JavaScript to inject the navbar into any html file using a placeholder nav id, so all I needed
were two lines of code, one that points to the script in navbar, and a nav placeholder. This allowed me to 
clean up the source files and not have to copy paste the navbar on every single web page that I created, easing
the amount of work I had to do. At this point, I had 5 web pages, one of which was the home page, and 4 blank pages
with a working navbar in it. Before I started fleshing out the rest of the content on the website, I decided to 
try and get github pages working. 


## Github Pages
Gihub pages came with some hiccups. While the setup of github pages was quite easy, all I had to do was rename the
repository to my username followed by github.io, and activate pages in the settings of the repository, I found that
routes and css were my next issue. First off, my CSS wasnt working, and secondly my routes to my other pages werent
working either, while all of this worked with not issue using a plugin called live server to run the html locally on 
my machine. I found, through some research online, that the css needs to be clearly marked as only "styles.css" and
I could not include a / before or after the reference. I also found that github pages prefers to use relative paths
over absolute paths. In using absolute paths, URL's would be copied on top of the existing URL, leading to improper
routes and no pretty web pages. After changing the paths to relative, and updating where my css was referenced, the 
website was working and I had all my web pages viewable, albeit a bit empty at this point. This was by far the most
confusing part of this project. Knowing that I now had a working website, I could finally move on to fleshing out 
the content of the website. 


## Contact
I started the content of my website with the contact form. Since this was something I had a reference to with a previous
assignment, I decided to use the previous assignment for the contact form. I changed the fields from the assignment,
added more placeholder text and and changed the font to match that of my navbars font. It was actually at this point
that I decided to use the font from the navbar within all of my web pages. While I had a nice contact page, I also
wanted it to work. After some online research I found a free api that will send you a real email upon submission, 
up to 100 emails a month in their free version! The shocking part is that all I had to do was update the action of 
the form with the API for it to work, so there was not much ground work needed at all. In the contact forms current
iteration, I will receive an email when the submit button is pressed. About was the next page I decided to work on
as I wanted to answer the question, who am I?


## About
I had the most fun with about, because who doesnt like to talk about themselves? I decided to hop onto my mac
and browse through all the photos I had taken picking out the ones I liked the most. Once I had felt good about
the number of photos, I pushed them all to the repository. I decided for the format of about to be some intro
text about myself, and a 4 column collage of my adventures over the last couple of years. I staggered the photos
to be somewhat symmetrical and added a panoramic photo at the bottom for some extra flair. I did some simple optimizing
on this by adding lazy loading to the pictures that arent seen first, and eager loading to the pictures that are seen
first, since I did notice a little delay on loading depending on what device, or internet connection one had. When 
viewing this on a phone, all the photos are displayed in a single column for responsiveness. 


## Previous Work


## Projects

