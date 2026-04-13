const http = require('http');
const { WebSocketServer } = require('ws');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4'
};

// ==================== BANCOS DE PERGUNTAS ====================

const neuralNetQuestions = [
    {
        question: "Qual é a tradução literal de Aprendizado de Máquina?",
        options: ["Deep Learning", "Machine Learning", "Artificial Intelligence", "Data Science"],
        correct: 1
    },
    {
        question: "Quem é conhecido por ser o pai da IA?",
        options: ["Isaac Newton", "Nikola Tesla", "Alan Turing", "Albert Einstein"],
        correct: 2
    },
    {
        question: "Quando Alan Turing morreu?",
        options: ["1945", "1962", "1954", "1970"],
        correct: 2
    },
    {
        question: "Como uma máquina adquire conhecimento?",
        options: ["Compilar, Executar, Depurar", "Receber Dados, Observar, Interagir", "Ler, Escrever, Apagar", "Conectar, Baixar, Instalar"],
        correct: 1
    },
    {
        question: "Quais são os 2 métodos de aprendizado de máquina?",
        options: ["Método supervisionado e não supervisionado", "Método rápido e lento", "Método linear e exponencial", "Método estático e dinâmico"],
        correct: 0
    },
    {
        question: "No método supervisionado, a partir do input, temos:",
        options: ["Feedback", "Erro", "Output", "Reinício"],
        correct: 2
    },
    {
        question: "Qual a metodologia do método reforço?",
        options: ["Cópia e colagem", "Tentativa e erro", "Leitura e escrita", "Análise e síntese"],
        correct: 1
    },
    {
        question: "Quais eram os atributos da rede neural do jogo do dinossauro?",
        options: ["Cor, Tamanho, Formato", "Distância, Altura, Velocidade", "Peso, Largura, Tempo", "Ângulo, Força, Gravidade"],
        correct: 1
    },
    {
        question: "Quais eram os neurônios de ações do dinossauro?",
        options: ["Correr e Parar", "Pular e Abaixar", "Atirar e Defender", "Avançar e Recuar"],
        correct: 1
    },
    {
        question: "Quem é o filho mais lindo da família?",
        options: ["Tati", "Guilherme", "Zenon", "Ana"],
        correct: 1
    }
];

const familiaQuestions = [
    {
        question: "Qual foi o primeiro destino fora de BH onde nós 6 viajamos juntos?",
        options: ["Inhotim", "Bahia", "Santos", "Rio de Janeiro"],
        correct: 0
    },
    {
        question: "Qual foi o último lugar que fomos juntos antes do intercâmbio do Gui?",
        options: ["Cinema", "Bar", "Boliche", "Restaurante"],
        correct: 2
    },
    {
        question: "Qual foi o personagem simbólico que caracterizou a Patricia no topo da Torre Eiffel?",
        options: ["Churchill", "Che Guevara", "Stalin", "Maduro"],
        correct: 1
    },
    {
        question: "Quando alguém não quer mais comer perto do Zenon, ele fala: Gordo é igual...?",
        options: ["Uma zebra", "Um tijolo", "Uma vaca", "Uma lata de lixo"],
        correct: 3
    },
    {
        question: "Antes de começar qualquer frase complexa, a Tati fala...?",
        options: ["De acordo com a psicologia", "Tem um negócio na psicologia", "A psicologia indica", "Sobre a psicologia"],
        correct: 1
    },
    {
        question: "Quais são as 3 peneiras de Sócrates?",
        options: ["Verdade, Bondade, Necessidade", "Razão, Emoção, Intuição", "Justiça, Coragem, Sabedoria", "Fé, Esperança, Caridade"],
        correct: 0
    },
    {
        question: "No casamento da Ana e do Gui, a Vivica entrou com uma placa que dizia:",
        options: ["Lá vem a noiva", "Daminha em treinamento", "Tio, casa comigo também?", "Enfim, casados!"],
        correct: 1
    },
    {
        question: "Nos votos do Gui, qual era o sonho da Ana?",
        options: ["Morar no Alphaville", "Viajar o mundo", "Passear com um salsicha pelo castelo", "Ver aurora boreal"],
        correct: 2
    },
    {
        question: "Como chama o gato cinza?",
        options: ["Frajola", "Alfredo", "Tom", "Gato cinza"],
        correct: 3
    },
    {
        question: "Qual país europeu todos da família já visitaram em comum?",
        options: ["Inglaterra", "França", "Holanda", "Bélgica"],
        correct: 2
    },
    {
        question: "Onde nos encontramos todos juntos após vermos neve pela primeira vez?",
        options: ["Praça", "Show", "Café", "Restaurante"],
        correct: 3
    },
    {
        question: "Qual foi o tema da festa da Vivica de 1 ano?",
        options: ["Minnie", "Doces", "Sol", "Melancia"],
        correct: 2
    }
];

const randomQuestions = [
    {
        question: "Qual é o maior planeta do Sistema Solar?",
        options: ["Marte", "Júpiter", "Saturno", "Netuno"],
        correct: 1
    },
    {
        question: "Em que ano o homem pisou na Lua pela primeira vez?",
        options: ["1965", "1969", "1972", "1961"],
        correct: 1
    },
    {
        question: "Qual é o animal terrestre mais rápido do mundo?",
        options: ["Leão", "Guepardo", "Cavalo", "Antílope"],
        correct: 1
    },
    {
        question: "Qual é o rio mais longo do mundo?",
        options: ["Amazonas", "Mississipi", "Nilo", "Yangtzé"],
        correct: 2
    },
    {
        question: "Quem escreveu 'Dom Quixote'?",
        options: ["Shakespeare", "Miguel de Cervantes", "Machado de Assis", "Victor Hugo"],
        correct: 1
    },
    {
        question: "Qual é o menor país do mundo em área?",
        options: ["Mônaco", "Vaticano", "San Marino", "Liechtenstein"],
        correct: 1
    },
    {
        question: "Quantos ossos tem o corpo humano adulto?",
        options: ["196", "206", "216", "186"],
        correct: 1
    },
    {
        question: "Qual é a velocidade da luz (aproximada)?",
        options: ["150.000 km/s", "300.000 km/s", "500.000 km/s", "100.000 km/s"],
        correct: 1
    },
    {
        question: "Em qual continente fica o Deserto do Saara?",
        options: ["Ásia", "América do Sul", "África", "Oceania"],
        correct: 2
    },
    {
        question: "Qual instrumento tem 88 teclas?",
        options: ["Órgão", "Acordeão", "Piano", "Cravo"],
        correct: 2
    },
    {
        question: "Qual é a capital do Japão?",
        options: ["Osaka", "Kyoto", "Tóquio", "Hiroshima"],
        correct: 2
    },
    {
        question: "Qual é o elemento químico mais abundante no universo?",
        options: ["Oxigênio", "Hélio", "Hidrogênio", "Carbono"],
        correct: 2
    },
    {
        question: "Quem pintou 'A Noite Estrelada'?",
        options: ["Monet", "Van Gogh", "Picasso", "Da Vinci"],
        correct: 1
    },
    {
        question: "Em que ano começou a Segunda Guerra Mundial?",
        options: ["1935", "1939", "1941", "1937"],
        correct: 1
    },
    {
        question: "Qual é o maior oceano do mundo?",
        options: ["Atlântico", "Índico", "Ártico", "Pacífico"],
        correct: 3
    },
    {
        question: "Quantas cores tem o arco-íris?",
        options: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        question: "Qual é a moeda do Reino Unido?",
        options: ["Euro", "Dólar", "Libra Esterlina", "Franco"],
        correct: 2
    },
    {
        question: "De que país é originário o sushi?",
        options: ["China", "Japão", "Coreia do Sul", "Tailândia"],
        correct: 1
    },
    {
        question: "Qual planeta é conhecido como 'Planeta Vermelho'?",
        options: ["Vênus", "Júpiter", "Marte", "Saturno"],
        correct: 2
    },
    {
        question: "Qual é a fórmula química da água?",
        options: ["CO₂", "H₂O", "NaCl", "O₂"],
        correct: 1
    }
];

const englishQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "How many continents are there on Earth?",
        options: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        question: "What color do you get when you mix red and white?",
        options: ["Orange", "Pink", "Purple", "Gray"],
        correct: 1
    },
    {
        question: "Which animal is known as the King of the Jungle?",
        options: ["Tiger", "Elephant", "Lion", "Bear"],
        correct: 2
    },
    {
        question: "How many days are there in a week?",
        options: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: 3
    },
    {
        question: "What planet is closest to the Sun?",
        options: ["Venus", "Mercury", "Earth", "Mars"],
        correct: 1
    },
    {
        question: "How many legs does a spider have?",
        options: ["6", "8", "10", "12"],
        correct: 1
    },
    {
        question: "What is the freezing point of water in Celsius?",
        options: ["-10°C", "0°C", "10°C", "100°C"],
        correct: 1
    },
    {
        question: "Which fruit is known for keeping the doctor away?",
        options: ["Banana", "Orange", "Apple", "Grape"],
        correct: 2
    },
    {
        question: "What is the tallest animal in the world?",
        options: ["Elephant", "Giraffe", "Horse", "Camel"],
        correct: 1
    },
    {
        question: "How many letters are in the English alphabet?",
        options: ["24", "25", "26", "27"],
        correct: 2
    },
    {
        question: "What gas do plants absorb from the air?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correct: 2
    },
    {
        question: "Which country is famous for pizza and pasta?",
        options: ["France", "Spain", "Italy", "Greece"],
        correct: 2
    },
    {
        question: "What shape has three sides?",
        options: ["Square", "Circle", "Triangle", "Pentagon"],
        correct: 2
    },
    {
        question: "What is the opposite of 'hot'?",
        options: ["Warm", "Cold", "Cool", "Mild"],
        correct: 1
    },
    {
        question: "How many months have 31 days?",
        options: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        question: "What do bees produce?",
        options: ["Milk", "Honey", "Sugar", "Wax"],
        correct: 1
    },
    {
        question: "Which is the smallest prime number?",
        options: ["0", "1", "2", "3"],
        correct: 2
    },
    {
        question: "What currency is used in the United States?",
        options: ["Euro", "Pound", "Dollar", "Yen"],
        correct: 2
    },
    {
        question: "What is the boiling point of water in Celsius?",
        options: ["50°C", "75°C", "100°C", "150°C"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Jupiter", "Mars", "Saturn", "Venus"],
        correct: 1
    },
    {
        question: "How many sides does a hexagon have?",
        options: ["4", "5", "6", "8"],
        correct: 2
    },
    {
        question: "What is the largest mammal on Earth?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippo"],
        correct: 1
    },
    {
        question: "Which language has the most native speakers in the world?",
        options: ["English", "Spanish", "Mandarin Chinese", "Hindi"],
        correct: 2
    },
    {
        question: "What is the main ingredient in guacamole?",
        options: ["Tomato", "Avocado", "Pepper", "Onion"],
        correct: 1
    },
    {
        question: "How many hours are in a day?",
        options: ["12", "20", "24", "36"],
        correct: 2
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Quartz"],
        correct: 2
    },
    {
        question: "Which ocean is between America and Europe?",
        options: ["Pacific", "Indian", "Atlantic", "Arctic"],
        correct: 2
    },
    {
        question: "What color is a ruby?",
        options: ["Blue", "Green", "Red", "Yellow"],
        correct: 2
    },
    {
        question: "How many players are on a soccer team on the field?",
        options: ["9", "10", "11", "12"],
        correct: 2
    },
    {
        question: "What animal is Nemo in the movie 'Finding Nemo'?",
        options: ["Dolphin", "Shark", "Clownfish", "Turtle"],
        correct: 2
    },
    {
        question: "What is the capital of Japan?",
        options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
        correct: 2
    },
    {
        question: "Which gas do humans need to breathe?",
        options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Helium"],
        correct: 2
    },
    {
        question: "What is 7 x 8?",
        options: ["48", "54", "56", "64"],
        correct: 2
    },
    {
        question: "What is the largest continent by area?",
        options: ["Africa", "North America", "Asia", "Europe"],
        correct: 2
    },
    {
        question: "Which instrument has black and white keys?",
        options: ["Guitar", "Violin", "Piano", "Drums"],
        correct: 2
    },
    {
        question: "How many bones does an adult human body have?",
        options: ["106", "206", "306", "406"],
        correct: 1
    },
    {
        question: "What is the speed of light approximately?",
        options: ["300 km/s", "3,000 km/s", "300,000 km/s", "3,000,000 km/s"],
        correct: 2
    },
    {
        question: "Which season comes after winter?",
        options: ["Summer", "Autumn", "Spring", "Monsoon"],
        correct: 2
    },
    {
        question: "What does 'H2O' stand for?",
        options: ["Helium dioxide", "Hydrogen oxide", "Water", "Heavy oxygen"],
        correct: 2
    },
    {
        question: "Who wrote the play 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
        correct: 1
    },
    {
        question: "What is the national sport of the United States?",
        options: ["Soccer", "Basketball", "Baseball", "Football"],
        correct: 2
    },
    {
        question: "Which country gifted the Statue of Liberty to the USA?",
        options: ["England", "Spain", "France", "Germany"],
        correct: 2
    },
    {
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "14"],
        correct: 2
    },
    {
        question: "Which vitamin do we get from sunlight?",
        options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
        correct: 3
    },
    {
        question: "How many strings does a standard guitar have?",
        options: ["4", "5", "6", "8"],
        correct: 2
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2
    },
    {
        question: "Which bird is the symbol of peace?",
        options: ["Eagle", "Dove", "Owl", "Sparrow"],
        correct: 1
    },
    {
        question: "What is the largest desert in the world?",
        options: ["Sahara", "Gobi", "Antarctic", "Arabian"],
        correct: 2
    }
];

// ==================== PROFILE GAME WORDS ====================
const profileWords = [
    { word: "Sun", hints: ["It is something you can see every day.", "It rises in the east.", "It sets in the west.", "It gives us light.", "It gives us warmth.", "Plants need it to grow.", "It is a star.", "It is the closest star to Earth.", "It is about 93 million miles away.", "Its surface is extremely hot.", "It has solar flares.", "It is yellow or orange in color.", "Without it, life would not exist.", "It is at the center of our solar system.", "Earth orbits around it.", "It is made mostly of hydrogen.", "It creates shadows.", "You should never look directly at it.", "Sunscreen protects you from it.", "It has three letters."] },
    { word: "Piano", hints: ["It is a musical instrument.", "It has black and white parts.", "It has 88 keys.", "You play it by pressing keys.", "It can be grand or upright.", "Beethoven played it.", "It is found in concert halls.", "It is very heavy.", "It produces sound with hammers and strings.", "It was invented around 1700.", "Children often take lessons for it.", "It can play both melody and chords.", "A baby version is called a keyboard.", "It has pedals at the bottom.", "Its full name means soft and loud.", "It is used in jazz and classical music.", "Tuning it requires a specialist.", "It usually sits on the floor.", "It is made of wood.", "It has five letters."] },
    { word: "Elephant", hints: ["It is a very large animal.", "It lives in Africa and Asia.", "It has a long trunk.", "It has big floppy ears.", "It is gray in color.", "It is the largest land animal.", "It has thick skin.", "It can weigh over 10000 pounds.", "It has tusks made of ivory.", "It lives in herds.", "It is very intelligent.", "It uses its trunk to drink water.", "Baby ones are called calves.", "It can live up to 70 years.", "It is a herbivore.", "It has a great memory.", "It can swim.", "It communicates with low rumbles.", "It is a symbol of wisdom.", "It has eight letters."] },
    { word: "Football", hints: ["It is a popular sport.", "It is played on a field.", "Two teams compete against each other.", "It involves kicking a ball.", "The World Cup is its biggest event.", "Each team has 11 players.", "One player is a goalkeeper.", "A match lasts 90 minutes.", "It is called soccer in some countries.", "The ball is round.", "Yellow and red cards are used.", "Pelé was famous at it.", "Goals decide who wins.", "It is the most popular sport in the world.", "It is played on grass.", "Players wear cleats.", "Offside is a rule.", "There is a penalty kick.", "FIFA governs it.", "It has eight letters."] },
    { word: "Moon", hints: ["You can see it at night.", "It orbits Earth.", "It reflects sunlight.", "It has phases.", "A full one is very bright.", "Astronauts have walked on it.", "It controls ocean tides.", "It has craters on its surface.", "It takes about 27 days to orbit Earth.", "It has no atmosphere.", "It appears different sizes.", "Neil Armstrong first stepped on it.", "It is Earth's only natural satellite.", "It can sometimes be seen during the day.", "A lunar eclipse involves it.", "Werewolf legends involve it.", "It is about 240000 miles away.", "It has no light of its own.", "The dark side is always hidden.", "It has four letters."] },
    { word: "Chocolate", hints: ["It is a popular treat.", "It can be dark, milk, or white.", "It comes from cacao beans.", "It melts in your mouth.", "It is often given on Valentine's Day.", "It is brown in color.", "Switzerland is famous for making it.", "It can be in bar or liquid form.", "Hot cocoa is made from it.", "It is used in cakes and cookies.", "Many people crave it.", "It contains caffeine.", "Easter eggs are made of it.", "It was first used by the Aztecs.", "It can be bitter or sweet.", "It pairs well with strawberries.", "Willy Wonka made a factory of it.", "It releases endorphins.", "It can be organic or processed.", "It has nine letters."] },
    { word: "Guitar", hints: ["It is a musical instrument.", "It has strings.", "It usually has six strings.", "It can be acoustic or electric.", "You strum or pluck it.", "Rock bands use it.", "It has a neck and body.", "It can be played with a pick.", "It is popular in country music.", "It is made of wood.", "Jimi Hendrix was famous for playing it.", "It has frets along the neck.", "It can be classical with nylon strings.", "A capo changes its key.", "It is portable and lightweight.", "Flamenco music features it.", "It can be amplified.", "Chord charts help beginners.", "It is one of the most popular instruments.", "It has six letters."] },
    { word: "Ocean", hints: ["It covers most of Earth's surface.", "It is full of salt water.", "It is home to whales and dolphins.", "It has waves.", "It is very deep.", "The Mariana Trench is its deepest point.", "It has five named ones.", "Ships sail on it.", "It is blue in color.", "Coral reefs are found in it.", "It produces much of our oxygen.", "Tides happen in it.", "Surfers ride its waves.", "It contains enormous pressure at depth.", "The Pacific is the largest one.", "It has currents that move water globally.", "Sharks live in it.", "It covers about 71 percent of Earth.", "Marine biologists study it.", "It has five letters."] },
    { word: "Apple", hints: ["It is a fruit.", "It can be red, green, or yellow.", "It grows on trees.", "It is very common.", "There is a famous company named after it.", "Teachers are often given one.", "It keeps the doctor away.", "It has seeds inside.", "It can be made into juice.", "Apple pie is made from it.", "It is crunchy.", "It grows in orchards.", "Johnny Appleseed planted them.", "Newton had one fall on his head.", "It can be sweet or sour.", "Cider is made from it.", "It symbolizes knowledge.", "It is in the rose family of plants.", "You can eat it raw or cooked.", "It has five letters."] },
    { word: "Train", hints: ["It is a form of transportation.", "It runs on tracks.", "It can carry many passengers.", "It has a locomotive.", "It was important during the Industrial Revolution.", "It makes a choo-choo sound.", "A conductor works on it.", "It stops at stations.", "Bullet versions are very fast.", "It can carry freight.", "It runs on diesel or electricity.", "The Orient Express was a famous one.", "It follows a set schedule.", "It has multiple cars linked together.", "Subways are an underground version.", "It has a horn or whistle.", "It cannot easily change direction.", "Commuters use it daily.", "Model versions are a popular hobby.", "It has five letters."] },
    { word: "Penguin", hints: ["It is a bird.", "It cannot fly.", "It lives in cold climates.", "It is black and white.", "It waddles when it walks.", "It is an excellent swimmer.", "It lives mostly in the Southern Hemisphere.", "Emperor ones are the largest.", "It eats fish and krill.", "It huddles for warmth.", "It has flippers instead of wings.", "It lives in colonies.", "A movie called Happy Feet features it.", "The male incubates the egg.", "It can dive deep underwater.", "It is found in Antarctica.", "It has waterproof feathers.", "It looks like it wears a tuxedo.", "Linux uses one as a mascot.", "It has seven letters."] },
    { word: "Camera", hints: ["It captures images.", "It uses a lens.", "It can be digital or film.", "Photographers use it.", "It has a shutter.", "It can take videos too.", "Smartphones have one built in.", "It needs light to work well.", "A flash helps in the dark.", "It was invented in the 1800s.", "DSLR is a professional type.", "It stores memories.", "It has settings like ISO and aperture.", "Selfies are taken with it.", "It uses a sensor or film.", "Polaroid made instant ones.", "It can zoom in on subjects.", "Paparazzi always carry one.", "It can have interchangeable lenses.", "It has six letters."] },
    { word: "Diamond", hints: ["It is a precious stone.", "It is extremely hard.", "It is used in jewelry.", "It is often found in rings.", "It sparkles in light.", "It is formed under high pressure.", "It is made of carbon.", "It is the hardest natural material.", "It is a symbol of engagement.", "It is mined from the earth.", "It can cut glass.", "It is very expensive.", "Famous ones have names.", "It comes in different cuts.", "South Africa is known for mining them.", "It is measured in carats.", "It can be clear or colored.", "The Hope Diamond is famous.", "It is a girl's best friend.", "It has seven letters."] },
    { word: "Rainbow", hints: ["It appears in the sky.", "It has multiple colors.", "It forms after rain.", "It is an arc shape.", "It has seven colors.", "Red, orange, yellow, green, blue, indigo, violet.", "Sunlight creates it through water droplets.", "It is a natural phenomenon.", "Legends say a pot of gold is at its end.", "You cannot touch it.", "It is caused by refraction of light.", "Double ones are rare.", "It symbolizes hope.", "It is visible when sun is behind you.", "It can also form in waterfalls.", "It was a sign from God to Noah.", "Each color blends into the next.", "It needs both sun and rain.", "It is a complete circle from above.", "It has seven letters."] },
    { word: "Bicycle", hints: ["It has two wheels.", "You pedal it.", "It is a form of transportation.", "It has handlebars.", "It needs balance to ride.", "It has brakes.", "It does not use fuel.", "It is human powered.", "It has a chain.", "It can have gears.", "Children learn to ride with training wheels.", "It is used in the Tour de France.", "It is good exercise.", "It has a seat called a saddle.", "It uses tires.", "It was invented in the 1800s.", "It is an eco-friendly transport.", "It is popular in the Netherlands.", "Mountain versions go off-road.", "It has seven letters."] },
    { word: "Airplane", hints: ["It flies in the sky.", "It has wings.", "It carries passengers.", "It uses jet engines.", "Wright brothers invented the first one.", "It takes off from a runway.", "It lands at airports.", "A pilot controls it.", "It can fly above the clouds.", "It has a cockpit.", "It travels very fast.", "It is used for long-distance travel.", "It has seatbelts.", "Turbulence can shake it.", "It has landing gear.", "Food is served on long flights.", "First class is a luxury section.", "It uses fuel called jet fuel.", "Flight attendants work on it.", "It has eight letters."] },
    { word: "Volcano", hints: ["It is a natural formation.", "It can erupt.", "Lava comes out of it.", "It is a type of mountain.", "Pompeii was buried by one.", "It has a crater at the top.", "It is formed by tectonic activity.", "It can be active or dormant.", "Iceland has many of them.", "Ash clouds can come from it.", "The Ring of Fire has many.", "Hawaii was formed by them.", "Magma is lava before it surfaces.", "It can cause tsunamis.", "Mount Vesuvius is a famous one.", "It can create new islands.", "Hot springs are found near them.", "Geologists study them.", "Some are underwater.", "It has seven letters."] },
    { word: "Library", hints: ["It is a building.", "It contains many books.", "You can borrow items from it.", "It is usually quiet.", "A librarian works there.", "It has a card catalog or computer system.", "It is free to use.", "It has reading rooms.", "It has shelves of books.", "Many have computers for public use.", "You need a library card.", "Books must be returned on time.", "Alexandria had a famous ancient one.", "It can have audiobooks and DVDs.", "Story time is held for children.", "It is organized by the Dewey system.", "It promotes literacy.", "It is found in most towns.", "Some are mobile in a bus.", "It has seven letters."] },
    { word: "Compass", hints: ["It is a navigation tool.", "It points north.", "It uses a magnetic needle.", "Sailors use it.", "It has four cardinal directions.", "It was invented in China.", "Hikers carry one.", "It works anywhere on Earth.", "It helps you find direction.", "It is small and portable.", "It does not need batteries.", "North, south, east, and west.", "A rose diagram shows its directions.", "Boy Scouts learn to use it.", "It reacts to Earth's magnetic field.", "GPS has replaced it for many.", "It has a rotating dial.", "It is essential for orienteering.", "It does not work in outer space.", "It has seven letters."] },
    { word: "Telescope", hints: ["It is a scientific instrument.", "It magnifies distant objects.", "It is used to see stars.", "Galileo used an early one.", "It can be optical or radio.", "Astronomers use it.", "It has lenses or mirrors.", "The Hubble is a famous one.", "It makes far things look close.", "It is pointed at the sky.", "It was invented around 1608.", "Observatories house large ones.", "It can see planets.", "It can see galaxies.", "James Webb is a newer space one.", "It helps study the universe.", "Amateur versions are affordable.", "It has a tripod.", "It uses magnification power.", "It has nine letters."] },
    { word: "Lighthouse", hints: ["It is a tall structure.", "It is found near the coast.", "It produces a bright light.", "It guides ships at sea.", "It warns of dangerous rocks.", "It is often on a cliff.", "It has a rotating beam.", "It is painted in bright colors.", "A keeper used to live in it.", "It is a symbol of safety.", "Many are now automated.", "It stands near the ocean.", "It flashes at regular intervals.", "It is cylindrical or conical.", "Cape Hatteras has a famous one.", "It can be very old.", "It is found on postcards.", "Foghorns sometimes accompany it.", "It prevents shipwrecks.", "It has ten letters."] },
    { word: "Butterfly", hints: ["It is an insect.", "It has colorful wings.", "It starts as a caterpillar.", "It goes through metamorphosis.", "It can fly.", "It drinks nectar from flowers.", "It has a proboscis.", "Monarch ones migrate long distances.", "It has four wings.", "It is fragile and delicate.", "It symbolizes transformation.", "Its wings have patterns.", "It has six legs.", "It lives for weeks or months.", "It hatches from an egg.", "A cocoon is part of its life.", "Gardens attract them.", "Some mimic poisonous species.", "It has beautiful symmetry.", "It has nine letters."] },
    { word: "Pyramid", hints: ["It is an ancient structure.", "It has a triangular shape.", "Egypt is famous for them.", "The Great one is in Giza.", "It was built as a tomb.", "Pharaohs were buried in them.", "It is one of the wonders of the world.", "It is made of stone blocks.", "It has a square base.", "The Sphinx guards one.", "It is thousands of years old.", "Aztecs also built them.", "It can be very tall.", "Its construction is still debated.", "It points upward.", "It is a tourist attraction.", "It can be found in Mexico too.", "Howard Carter explored near them.", "It is in the Sahara desert.", "It has seven letters."] },
    { word: "Umbrella", hints: ["It protects you from rain.", "It can fold up.", "It has a handle.", "It opens and closes.", "It is made of waterproof material.", "It has a canopy.", "It can also block the sun.", "Mary Poppins had a famous one.", "It has a metal frame.", "It is carried in a bag.", "It is found in many colors.", "Beach ones are very large.", "It has a pointed tip.", "It can blow inside out in wind.", "It was invented thousands of years ago.", "Cocktails sometimes have tiny ones.", "It is an everyday item.", "It is sold at most stores.", "A parasol is a sunny version.", "It has eight letters."] },
    { word: "Kangaroo", hints: ["It is an animal.", "It hops to move.", "It lives in Australia.", "It has a pouch.", "It carries babies in its pouch.", "Baby ones are called joeys.", "It has powerful hind legs.", "It has a long tail.", "It can jump very far.", "It is a marsupial.", "It can be gray or red.", "It lives in the outback.", "Boxing ones are in cartoons.", "It cannot walk backwards easily.", "It is on the Australian coat of arms.", "It can be over six feet tall.", "It eats grass and plants.", "It lives in groups called mobs.", "Male ones are called boomers.", "It has eight letters."] },
    { word: "Anchor", hints: ["It is heavy.", "It is made of metal.", "It is found on ships.", "It keeps a vessel in place.", "It is dropped into the water.", "It sinks to the seabed.", "It has flukes that grip the bottom.", "It is connected by a chain.", "Sailors use it.", "It is a nautical tool.", "It is a common tattoo.", "It symbolizes stability.", "It can weigh thousands of pounds.", "It is stored on the bow.", "It was used by ancient Greeks.", "News presenters are also called this.", "It stops a boat from drifting.", "It comes in different designs.", "It is essential for docking.", "It has six letters."] },
    { word: "Tornado", hints: ["It is a weather event.", "It is a spinning column of air.", "It can be very destructive.", "It is shaped like a funnel.", "It touches the ground.", "It can destroy buildings.", "The Wizard of Oz features one.", "It is also called a twister.", "Tornado Alley is in the USA.", "A storm cellar provides safety.", "It is measured on the Fujita scale.", "It forms from thunderstorms.", "It can pick up cars.", "It moves across the land.", "Warning sirens alert people.", "Meteorologists track it.", "It can last minutes or hours.", "It has strong rotating winds.", "It can form over water as a waterspout.", "It has seven letters."] },
    { word: "Compass", hints: ["It is a tool for direction.", "It has a magnetic needle.", "North is always indicated.", "Explorers rely on it.", "It is small and round.", "It was used for ancient navigation.", "It has four main directions.", "Hikers keep one in their pack.", "It does not need electricity.", "It responds to Earth's magnetism.", "A compass rose shows its design.", "It helps prevent getting lost.", "Navy ships historically used it.", "It is simple but effective.", "It has a rotating dial.", "Modern phones have a digital version.", "It is used in orienteering sports.", "It was a Chinese invention.", "It always points to magnetic north.", "It has seven letters."] },
    { word: "Dolphin", hints: ["It is a marine animal.", "It lives in the ocean.", "It is very intelligent.", "It can jump out of water.", "It makes clicking sounds.", "It uses echolocation.", "It is a mammal, not a fish.", "It breathes air.", "It has a dorsal fin.", "It lives in pods.", "It is playful and friendly.", "Flipper was a famous one.", "It can swim very fast.", "It has a beak-like snout.", "It is gray in color.", "It communicates with whistles.", "It is found in warm waters.", "It has been known to help humans.", "Aquariums sometimes house them.", "It has seven letters."] },
    { word: "Cactus", hints: ["It is a plant.", "It grows in the desert.", "It has spines.", "It stores water inside.", "It can survive extreme heat.", "It does not need much rain.", "It has thick skin.", "Some bloom beautiful flowers.", "It can be very tall.", "The saguaro is a famous type.", "It is found in the Americas.", "It has no typical leaves.", "It can live for many years.", "Some produce edible fruit.", "It is a succulent.", "Cowboy movies often show it.", "It is green in color.", "It can be a houseplant.", "Tequila comes from a related plant.", "It has six letters."] },
    { word: "Castle", hints: ["It is a large building.", "It has thick walls.", "Kings and queens lived in them.", "It was built for defense.", "It often has a moat.", "It has towers.", "It is made of stone.", "It is found in Europe.", "Drawbridges are part of it.", "It can have dungeons.", "It is medieval.", "It has battlements.", "Knights defended it.", "Disney has a famous one.", "It can have a courtyard.", "It is a tourist attraction.", "Cinderella lived in one.", "Windsor is a famous one.", "It has a throne room.", "It has six letters."] },
    { word: "Violin", hints: ["It is a musical instrument.", "It has four strings.", "It is played with a bow.", "It produces a high-pitched sound.", "It is part of an orchestra.", "It is made of wood.", "It rests under the chin.", "Stradivarius made famous ones.", "It is in the string family.", "Classical music features it heavily.", "It can play both melody and harmony.", "It has an f-shaped soundhole.", "A fiddler plays a folk version.", "It is smaller than a viola.", "Rosin is used on the bow.", "It requires years of practice.", "It is very expressive.", "It has a scroll at the top.", "Vivaldi wrote many pieces for it.", "It has six letters."] },
    { word: "Rocket", hints: ["It flies into space.", "It uses powerful engines.", "It carries astronauts.", "It launches from a pad.", "NASA uses them.", "It burns fuel very fast.", "It can reach orbit.", "SpaceX makes reusable ones.", "It creates a huge flame.", "It has stages that separate.", "It can carry satellites.", "Countdown precedes its launch.", "It travels faster than sound.", "Apollo missions used one.", "It overcomes gravity.", "It needs thrust to fly.", "It can be very tall.", "Fireworks are small versions.", "It is used for space exploration.", "It has six letters."] },
    { word: "Skeleton", hints: ["It is inside your body.", "It is made of bones.", "Humans have 206 of its parts.", "It gives the body structure.", "It protects organs.", "The skull is part of it.", "The spine is part of it.", "It is a Halloween decoration.", "X-rays can show it.", "Joints connect its parts.", "It supports muscles.", "A baby has more parts than an adult.", "Calcium keeps it strong.", "Dinosaur versions are in museums.", "It can be found in fossils.", "It is framework of the body.", "It is white when dry.", "It can break and heal.", "Medical students study it.", "It has eight letters."] },
    { word: "Snowflake", hints: ["It forms in clouds.", "It is made of ice crystals.", "No two are exactly alike.", "It is white.", "It falls in winter.", "It is very small.", "It has a hexagonal shape.", "It melts when it gets warm.", "Many of them make snow.", "It is symmetrical.", "It forms around a tiny particle.", "It is fragile.", "Scientists photograph them under microscopes.", "It is cold to the touch.", "It can be used as a decoration.", "It represents winter.", "It drifts gently to the ground.", "Blizzards have billions of them.", "It starts as water vapor.", "It has nine letters."] },
    { word: "Treasure", hints: ["It is something valuable.", "Pirates searched for it.", "It is often hidden.", "A map can lead to it.", "It can be gold or jewels.", "It is buried sometimes.", "X marks the spot.", "Treasure chests hold it.", "It is found in adventure stories.", "Egyptian tombs contained it.", "It can be worth millions.", "Explorers hunt for it.", "Sunken ships may contain it.", "It is associated with adventure.", "It can be an heirloom.", "Museums display historical ones.", "Legends tell of cursed ones.", "Metal detectors help find it.", "It brings excitement.", "It has eight letters."] },
    { word: "Giraffe", hints: ["It is an animal.", "It has a very long neck.", "It is the tallest living animal.", "It lives in Africa.", "It has spots.", "It eats leaves from tall trees.", "Its tongue is very long.", "It is a herbivore.", "It has small horns called ossicones.", "Its pattern is unique like fingerprints.", "Baby ones are about six feet at birth.", "It can run surprisingly fast.", "It sleeps very little.", "It has a blue-purple tongue.", "It lives in savannas.", "It has long legs.", "Its heart is very large.", "It drinks water by spreading its legs wide.", "It is gentle and quiet.", "It has seven letters."] },
    { word: "Waterfall", hints: ["It is a natural feature.", "Water flows downward over a cliff.", "Niagara is a famous one.", "It creates a splashing sound.", "It can be very tall.", "It is found in rivers.", "Angel Falls is the tallest one.", "It creates mist.", "It erodes rock over time.", "It is a popular tourist attraction.", "Some have pools at the bottom.", "It is beautiful and scenic.", "It can generate hydroelectric power.", "It is found in jungles and mountains.", "Victoria Falls is between two countries.", "Kayakers sometimes go over small ones.", "Rainbows often appear near it.", "It is part of the water cycle.", "Fish sometimes cannot pass it.", "It has nine letters."] },
    { word: "Lantern", hints: ["It produces light.", "It can use a candle or fuel.", "It is portable.", "Campers use it.", "It has a handle.", "Paper ones are common in Asia.", "Jack-o-lanterns are carved pumpkins.", "It was used before electricity.", "It can hang from a hook.", "The Green Lantern is a superhero.", "Chinese festivals feature floating ones.", "It has a protective casing.", "It illuminates dark areas.", "Oil versions burn kerosene.", "It can be decorative.", "It glows warmly.", "It is found in old houses.", "LED versions are modern.", "It creates a cozy atmosphere.", "It has seven letters."] },
    { word: "Mosquito", hints: ["It is a tiny insect.", "It bites humans.", "It drinks blood.", "It buzzes near your ear.", "It leaves itchy bumps.", "Only females bite.", "It spreads diseases.", "Malaria is transmitted by it.", "It breeds in standing water.", "Bug spray repels it.", "It is found worldwide.", "It is active at dusk.", "It has thin wings.", "It uses a proboscis to bite.", "It is attracted to body heat.", "Citronella deters it.", "It is one of the deadliest animals.", "Mosquito nets protect against it.", "Bats eat many of them.", "It has eight letters."] },
    { word: "Glacier", hints: ["It is made of ice.", "It moves very slowly.", "It is found in cold regions.", "It is formed from compacted snow.", "It carves valleys.", "It covers polar regions.", "It can be miles thick.", "It is found on mountains.", "Climate change is melting them.", "Icebergs break off from it.", "It shaped much of the landscape.", "It is thousands of years old.", "Antarctica has the largest one.", "It stores fresh water.", "It flows like a very slow river.", "Crevasses are dangerous cracks in it.", "The Ice Age had many.", "It is white or blue.", "It grinds rocks beneath it.", "It has seven letters."] },
    { word: "Parrot", hints: ["It is a bird.", "It can talk.", "It is very colorful.", "It mimics human speech.", "It lives in tropical regions.", "Pirates had them on their shoulders.", "It has a curved beak.", "It eats seeds and fruits.", "It can be a pet.", "Macaws are a type of it.", "It is very intelligent.", "Some live over 80 years.", "It has strong claws.", "Polly wants a cracker.", "It can be green, red, or blue.", "It lives in flocks.", "It nests in tree hollows.", "African Grey is a famous type.", "It can learn tricks.", "It has six letters."] },
    { word: "Tornado", hints: ["It is an extreme weather event.", "It spins very fast.", "It can destroy houses.", "It is funnel-shaped.", "Storm chasers follow it.", "It forms from severe thunderstorms.", "It occurs mostly in spring.", "The central US is prone to it.", "It makes a roaring sound.", "A basement is safe from it.", "The Fujita scale rates it.", "It can form in minutes.", "It can be invisible until it picks up debris.", "Mobile homes are very vulnerable.", "It moves unpredictably.", "Some last only seconds.", "It can have winds over 300 mph.", "Dorothy was caught in one.", "Warning systems save lives.", "It has seven letters."] },
    { word: "Compass", hints: ["It helps you find direction.", "Navigators depend on it.", "It has a magnetized needle.", "North is its primary reference.", "It is circular.", "Old explorers used it at sea.", "It has N, S, E, W markings.", "It sits flat in your hand.", "It does not require power.", "It was key to Age of Exploration.", "Orienteering uses it.", "A compass rose is a related symbol.", "It responds to magnetic poles.", "Scouts learn to read one.", "A declination correction may be needed.", "It is found in survival kits.", "Smartphones now simulate it.", "It is centuries old.", "It improved global trade.", "It has seven letters."] },
    { word: "Volcano", hints: ["It is a geological feature.", "It erupts with lava.", "Ash clouds can block the sun.", "Mount Etna is one.", "It forms from magma below Earth.", "Some are dormant for centuries.", "Krakatoa was a massive eruption.", "Hot springs surround it.", "Pompeii was destroyed by one.", "Hawaii was built by them.", "The Pacific Ring of Fire has many.", "It can create new landforms.", "Lava flows from its crater.", "It can trigger earthquakes.", "Shield types are broad and flat.", "Stratovolcanoes are tall and steep.", "Yellowstone sits on one.", "It releases gases.", "Geysers are related phenomena.", "It has seven letters."] },
    { word: "Astronaut", hints: ["This person travels to space.", "They wear a special suit.", "They float in zero gravity.", "They ride in a spacecraft.", "NASA trains them.", "They live on the space station.", "Neil Armstrong was the first on the Moon.", "They undergo intense training.", "They eat freeze-dried food.", "They do spacewalks.", "A helmet protects them.", "They experience sunrise 16 times a day.", "They need oxygen tanks.", "They communicate with Mission Control.", "They do experiments in space.", "Yuri Gagarin was the first.", "They exercise daily in space.", "They wear diapers in their suits.", "Their bones weaken in space.", "The word has nine letters."] },
    { word: "Sunflower", hints: ["It is a plant.", "It is tall and yellow.", "It faces the sun.", "It has a large flower head.", "Its seeds are edible.", "Birds love its seeds.", "It can grow over ten feet tall.", "Van Gogh painted famous ones.", "It is grown for oil.", "It has many petals.", "It symbolizes loyalty.", "It turns to follow sunlight.", "It has a dark center.", "It is planted in summer.", "Fields of them are scenic.", "Bees pollinate it.", "It is native to the Americas.", "It belongs to the daisy family.", "You can roast its seeds.", "It has nine letters."] },
    { word: "Penguin", hints: ["It is a flightless bird.", "It lives in cold places.", "It swims very well.", "It has a black and white body.", "It walks with a waddle.", "It lives in large colonies.", "Emperor ones march great distances.", "It breeds in harsh conditions.", "The male warms the egg.", "It eats fish and squid.", "It is found in Antarctica.", "It has dense waterproof feathers.", "It can hold its breath long.", "It slides on its belly.", "March of the Penguins is a famous movie.", "It can be quite social.", "Rockhopper ones have yellow tufts.", "It stays warm by huddling.", "Its black back hides it from predators above.", "It has seven letters."] },
    { word: "Compass", hints: ["Hikers use this tool.", "It indicates magnetic north.", "It is small and portable.", "It has a floating needle.", "Directions are marked around it.", "No batteries needed.", "Ancient Chinese invented it.", "Ships relied on it for centuries.", "It helps when GPS fails.", "N S E W are labeled.", "A liquid-filled capsule steadies the needle.", "It is essential for wilderness survival.", "Maps are used alongside it.", "Bearing is measured with it.", "It is round or square.", "Military have specialized versions.", "It can be worn on a wrist.", "A compass course follows its direction.", "It guided early world explorers.", "It has seven letters."] },
    { word: "Chocolate", hints: ["It comes from tropical trees.", "Cacao pods contain its raw form.", "It is processed into bars.", "It can be eaten or drunk.", "Belgium is famous for it.", "It has a rich flavor.", "It can be bittersweet.", "It is used in desserts.", "It contains theobromine.", "Hot versions warm you up.", "It was currency for the Maya.", "White versions have no cocoa solids.", "It pairs well with wine.", "Fondue uses melted versions.", "Truffles are a luxurious form.", "It can cause allergies in some people.", "It is wrapped in foil.", "Easter bunnies are made of it.", "Cocoa butter comes from it.", "It has nine letters."] },
    { word: "Kangaroo", hints: ["It hops on two legs.", "It is native to Australia.", "Females have a pouch.", "Baby ones are called joeys.", "It can leap over 30 feet.", "It uses its tail for balance.", "Red ones are the largest.", "It is a marsupial.", "It lives in the wild outback.", "It is on the Australian dollar.", "It boxes with its front paws.", "It grazes on grass.", "It can reach speeds of 35 mph.", "It lives in groups called mobs.", "Its hind legs are very powerful.", "Newborns are tiny and hairless.", "It has strong claws.", "It is a symbol of Australia.", "Tree versions live in rainforests.", "It has eight letters."] },
    { word: "Satellite", hints: ["It orbits Earth.", "It is launched by a rocket.", "It sends signals.", "It is used for communication.", "GPS uses many of them.", "It takes photos of Earth.", "It can be natural or artificial.", "The Moon is a natural one.", "Sputnik was the first artificial one.", "It helps forecast weather.", "It is very high above Earth.", "It moves very fast.", "It reflects sunlight at night.", "Dishes on roofs receive signals from it.", "It maps the planet.", "Military uses spy versions.", "It can study other planets.", "Solar panels power many of them.", "Thousands orbit Earth.", "It has nine letters."] },
    { word: "Microscope", hints: ["It is a scientific tool.", "It magnifies tiny things.", "It has lenses.", "Biologists use it.", "It lets you see cells.", "It has an eyepiece.", "It was invented around 1600.", "Bacteria were discovered with it.", "It can magnify hundreds of times.", "Lab benches have them.", "Electron versions are very powerful.", "It uses light.", "Slides hold specimens for it.", "Anton van Leeuwenhoek improved it.", "It is used in hospitals.", "It reveals a hidden world.", "Students use them in science class.", "It can show blood cells.", "Focusing knobs adjust it.", "It has ten letters."] },
    { word: "Firework", hints: ["It explodes in the sky.", "It is colorful.", "It is used in celebrations.", "It makes loud sounds.", "New Year's Eve features many.", "It is made with gunpowder.", "China invented it.", "It comes in different shapes.", "It lights up the night.", "Fourth of July uses many.", "It is launched from the ground.", "It creates patterns in the sky.", "Sparklers are a handheld type.", "It can be dangerous.", "It is sold at special stands.", "It is best viewed at night.", "It produces smoke.", "Professional shows are choreographed.", "It fills crowds with awe.", "It has eight letters."] },
    { word: "Crocodile", hints: ["It is a large reptile.", "It lives in water and on land.", "It has a powerful jaw.", "It has many sharp teeth.", "It is found in tropical areas.", "It can grow over 20 feet.", "It is a predator.", "It does the death roll.", "Its skin is thick and scaly.", "It has been around since dinosaur times.", "It lies in wait for prey.", "Its eyes and nostrils sit on top of its head.", "It is found in Australia and Africa.", "Steve Irwin was known for handling them.", "It can move fast on land.", "Baby ones are tiny.", "Nile ones are very large.", "It basks in the sun.", "It has a long snout.", "It has nine letters."] },
    { word: "Passport", hints: ["It is an important document.", "You need it to travel internationally.", "It has your photo.", "It has a unique number.", "It is issued by your government.", "It is small and booklet-shaped.", "Immigration officers check it.", "It has stamps from visited countries.", "It has an expiration date.", "It proves your identity.", "It shows your nationality.", "It comes in different colors.", "US ones are blue.", "It is kept safe while traveling.", "You apply at a government office.", "It contains personal information.", "Renewing it is needed periodically.", "Losing it abroad is a big problem.", "It is machine-readable.", "It has eight letters."] },
    { word: "Dolphin", hints: ["It is a marine mammal.", "It is very playful.", "It swims in groups called pods.", "It communicates with clicks.", "It has a blowhole.", "It is known for intelligence.", "It can leap high out of water.", "It is gray.", "Bottlenose is a famous type.", "It has been in many movies.", "It uses sonar to navigate.", "It eats fish.", "It can swim over 20 mph.", "It has a streamlined body.", "It is friendly to humans.", "Trainers work with them in parks.", "It breathes air at the surface.", "River versions exist.", "It has a curved mouth.", "It has seven letters."] },
    { word: "Tornado", hints: ["It is a violent wind event.", "It spins like a top.", "It can lift heavy objects.", "It forms a funnel cloud.", "It is measured by the EF scale.", "Basements are the safest place.", "It occurs with severe storms.", "Storm chasers study it.", "It can cross miles of land.", "Its path is often narrow.", "It can happen anywhere.", "Warning time can be very short.", "Debris makes it deadly.", "It can produce hail.", "It is most common in spring.", "Oklahoma has many.", "Damage can be total.", "Watches and warnings differ.", "Doppler radar detects it.", "It has seven letters."] },
    { word: "Skeleton", hints: ["It supports the body.", "Without it you could not stand.", "It is made of bones and cartilage.", "The ribcage is part of it.", "It protects the brain.", "Archaeologists find ancient ones.", "It changes as you age.", "Babies have soft parts.", "It is connected by joints.", "It is used in anatomy classes.", "It produces blood cells in marrow.", "The pelvis is part of it.", "Fractures damage it.", "Calcium makes it strong.", "It can reveal age and health.", "Vertebrates all have one.", "Museums display dinosaur ones.", "It is a Halloween symbol.", "It is internal in humans.", "It has eight letters."] },
    { word: "Helicopter", hints: ["It flies in the air.", "It has rotating blades.", "It can hover in place.", "It takes off vertically.", "It does not need a runway.", "It is used for rescue.", "News stations use it.", "It has a tail rotor.", "Military uses many of them.", "It can land on rooftops.", "A pilot flies it.", "It is noisier than a plane.", "Air ambulances use it.", "It can carry supplies.", "Sikorsky designed early ones.", "It is smaller than most planes.", "Police use it for chases.", "It can transport VIPs.", "It can fight forest fires.", "It has ten letters."] },
    { word: "Strawberry", hints: ["It is a fruit.", "It is red.", "It has tiny seeds on the outside.", "It is sweet.", "It grows close to the ground.", "It is used in jam.", "Shortcake features it.", "It is popular in smoothies.", "It has a green leafy top.", "It is a summer fruit.", "Dipping it in chocolate is popular.", "It grows in many countries.", "It is heart-shaped.", "It is used to flavor ice cream.", "It is rich in vitamin C.", "It has a strong aroma.", "You can pick them at farms.", "It is in the rose family.", "It can be frozen.", "It has ten letters."] },
    { word: "Thunder", hints: ["It is a loud sound.", "It comes from the sky.", "It follows lightning.", "It happens during storms.", "It can shake buildings.", "It is caused by expanding air.", "It can be scary.", "It rumbles and booms.", "Sound travels slower than light.", "You can count seconds to estimate distance.", "It is harmless by itself.", "Pets are often afraid of it.", "Thor is its Norse god.", "Thunderbolts are a sports team name.", "It can crack very loudly.", "It echoes off mountains.", "Rain usually accompanies it.", "It is more common in summer.", "It is a natural phenomenon.", "It has seven letters."] },
    { word: "Compass", hints: ["It is round with markings.", "It helps you navigate.", "It uses magnetism.", "A needle spins inside it.", "It always points to magnetic north.", "Explorers depended on it.", "It was vital for sea travel.", "It does not need technology.", "It has been used for over a thousand years.", "It is reliable.", "Maps work best with it.", "Survival kits include one.", "Scouts earn badges using it.", "It can be analog or digital.", "Lensatic versions are military grade.", "It fits in your pocket.", "A base plate helps with map reading.", "It measures bearings.", "It revolutionized exploration.", "It has seven letters."] },
    { word: "Dinosaur", hints: ["It lived millions of years ago.", "It is now extinct.", "Fossils prove they existed.", "T-Rex is the most famous one.", "Some were very large.", "Some were very small.", "They ruled the Earth for millions of years.", "An asteroid may have killed them.", "Jurassic Park is a movie about them.", "Some had feathers.", "Some ate plants.", "Some ate meat.", "Museums have their bones.", "Paleontologists study them.", "They laid eggs.", "Triceratops had three horns.", "Velociraptor was fast.", "They lived in the Mesozoic Era.", "Birds are their descendants.", "The word has eight letters."] },
    { word: "Popcorn", hints: ["It is a snack.", "It is made from corn.", "It pops when heated.", "It is popular at movies.", "It can be buttered.", "It can be salted or sweet.", "Microwaves can make it.", "It puffs up when cooked.", "Kernels are its raw form.", "It is light and fluffy.", "Caramel versions are sweet.", "It has been eaten for thousands of years.", "It fills a big bowl.", "It is sold at carnivals.", "Kettle corn is a variety.", "It smells great.", "It can get stuck in your teeth.", "It is a whole grain.", "Movie theaters charge a lot for it.", "It has seven letters."] },
    { word: "Candle", hints: ["It produces light.", "It has a flame.", "It is made of wax.", "It has a wick.", "It melts as it burns.", "It is used in power outages.", "Birthday cakes have them.", "It comes in many colors.", "It can be scented.", "It provides a warm glow.", "It was used before electricity.", "Churches use many of them.", "It is placed in a holder.", "You blow it out to extinguish it.", "Aromatherapy uses them.", "It can be made from beeswax.", "It can drip wax.", "Candlelight dinners are romantic.", "It comes in many shapes.", "It has six letters."] },
    { word: "Penguin", hints: ["It waddles on ice.", "It dives into frigid water.", "It can hold its breath.", "It gathers in large groups.", "It raises chicks in extreme cold.", "Father ones protect the egg.", "It eats mainly fish.", "Adelie is a small type.", "It is found near the South Pole.", "It is adapted to cold.", "Its feathers repel water.", "It cannot fly in the air.", "Some live in temperate zones.", "They communicate with calls.", "Predators include seals.", "It has a short tail.", "Zoo ones are very popular.", "It is featured in animated films.", "It is remarkably resilient.", "It has seven letters."] },
    { word: "Bamboo", hints: ["It is a plant.", "It grows very fast.", "Pandas eat it.", "It is hollow inside.", "It is very strong.", "It is used in construction.", "It grows in Asia.", "It can grow several feet per day.", "It is a type of grass.", "It is used for furniture.", "It is sustainable.", "Chopsticks are made from it.", "It has segmented stems.", "It can be woven into baskets.", "Flutes are made from it.", "It is green.", "Scaffolding in Asia uses it.", "It provides shade.", "It can form dense forests.", "It has six letters."] },
    { word: "Avalanche", hints: ["It happens on mountains.", "Snow slides downhill rapidly.", "It is very dangerous.", "Skiers can trigger it.", "It can bury people.", "Rescue dogs help find victims.", "Loud sounds can sometimes cause it.", "It moves at great speed.", "Beacons help locate buried people.", "Backcountry travelers fear it.", "It carries rocks and trees.", "Mountains in winter are prone.", "Risk increases after heavy snowfall.", "Warning signs include cracking snow.", "It can block roads.", "It moves like a wave.", "Survival chances decrease with time.", "It can be predicted somewhat.", "Alps and Rockies have many.", "It has nine letters."] },
    { word: "Octopus", hints: ["It is a sea creature.", "It has eight arms.", "It can change color.", "It is very intelligent.", "It squirts ink.", "It has no bones.", "It can squeeze through tiny spaces.", "It lives in the ocean.", "It has three hearts.", "It has blue blood.", "It can camouflage itself.", "It catches prey with suction cups.", "It is a mollusk.", "Some are venomous.", "The blue-ringed one is deadly.", "It can solve puzzles.", "It has a beak.", "It lives alone.", "It has a short lifespan.", "It has seven letters."] },
    { word: "Hospital", hints: ["It is a building.", "Sick people go there.", "Doctors work there.", "Nurses care for patients.", "Surgery happens there.", "It has emergency rooms.", "Ambulances bring patients to it.", "It has many beds.", "It has operating rooms.", "Babies are born there.", "It has labs for tests.", "It is open 24 hours.", "Visitors sign in.", "It has a pharmacy.", "It treats injuries.", "It has intensive care units.", "Wheelchairs are common there.", "It can be public or private.", "Medical students train there.", "It has eight letters."] },
    { word: "Flamingo", hints: ["It is a bird.", "It is pink.", "It stands on one leg.", "It lives near water.", "It eats shrimp and algae.", "Its color comes from its diet.", "It has long legs.", "It has a curved beak.", "It lives in warm regions.", "Flocks of them are striking.", "It is found in Africa and the Americas.", "Lawn ornaments look like it.", "Baby ones are white or gray.", "It wades in shallow water.", "It can fly.", "It builds mud nest mounds.", "It has a honking call.", "Las Vegas has a famous hotel named after it.", "It filters food through its beak.", "It has eight letters."] },
    { word: "Museum", hints: ["It is a building.", "It displays art or artifacts.", "Many are free to enter.", "It has exhibits.", "The Louvre is a famous one.", "It preserves history.", "Guides give tours.", "It can focus on science or art.", "The Smithsonian is well known.", "It has collections.", "School trips often go there.", "It has security guards.", "Photography may be restricted.", "Dinosaur bones are displayed.", "It has gift shops.", "It educates the public.", "It can be interactive.", "It is found in cities worldwide.", "Special exhibitions rotate.", "It has six letters."] },
    { word: "Chameleon", hints: ["It is a reptile.", "It changes color.", "It lives in trees.", "It has eyes that move independently.", "It catches insects with its tongue.", "Its tongue is very fast.", "It is found in Madagascar.", "It moves slowly.", "It has a curled tail.", "It grips branches with its feet.", "It is a master of camouflage.", "It is a type of lizard.", "Its color changes with mood.", "It is a popular exotic pet.", "It has a crest on its head.", "It is cold-blooded.", "Its feet are like pincers.", "It can look in two directions at once.", "It eats mainly bugs.", "It has nine letters."] },
    { word: "Watermelon", hints: ["It is a fruit.", "It is large and round.", "It is green on the outside.", "It is red or pink inside.", "It has many seeds.", "It is very juicy.", "It is eaten in summer.", "It is mostly water.", "It grows on a vine.", "It is heavy.", "It can be cut into slices.", "Its rinds can be pickled.", "Seedless varieties exist.", "It is refreshing on hot days.", "It is popular at picnics.", "It is in the gourd family.", "Some people salt it.", "It can be used in drinks.", "Its seeds can be roasted.", "It has ten letters."] },
    { word: "Pirate", hints: ["This person sailed the seas.", "They robbed ships.", "They flew a skull and crossbones flag.", "They searched for treasure.", "Blackbeard was a famous one.", "They wore eye patches.", "They had parrots on their shoulders.", "They said 'Arrr!'", "They used swords and cannons.", "They buried treasure.", "They sailed on galleons.", "Captain Hook is a fictional one.", "They lived by their own rules.", "They mapped treasure locations.", "The Caribbean had many.", "They walked the plank.", "Talk Like a Pirate Day exists.", "Johnny Depp played a famous one.", "They are feared on the sea.", "The word has six letters."] },
    { word: "Compass", hints: ["This tool finds direction.", "It uses Earth's magnetic field.", "It has a needle that spins.", "North is always shown.", "It requires no power.", "Sailors used it for centuries.", "It is found in hiking gear.", "It was a Chinese invention.", "It changed world navigation.", "N E S W are marked.", "It helped discover new lands.", "It is analog not digital.", "It sits on a flat surface.", "Declination is a factor.", "Scouting teaches its use.", "Emergency kits have one.", "It points to magnetic north.", "It is simple and reliable.", "A bearing is measured with it.", "It has seven letters."] },
    { word: "Jellyfish", hints: ["It lives in the ocean.", "It has tentacles.", "It can sting.", "It is mostly water.", "It has no brain.", "It has no bones.", "It floats with currents.", "It is translucent.", "Some glow in the dark.", "Box ones are very dangerous.", "It has been around for millions of years.", "It pulsates to move.", "Moon jelly is a common type.", "Some are tiny, some are huge.", "Vinegar helps treat its sting.", "It is not actually a fish.", "It drifts in blooms.", "Some eat plankton.", "It has a bell-shaped body.", "It has nine letters."] },
    { word: "Volcano", hints: ["Lava flows from it.", "It is a mountain-like formation.", "Eruptions can be violent.", "Ash falls like snow.", "Mt. Fuji is a dormant one.", "A caldera forms after a big eruption.", "Sulfur gases surround it.", "It creates fertile soil.", "Obsidian forms from its lava.", "Lava tubes are hollow tunnels.", "Supervolcanoes are the most powerful.", "Pyroclastic flows are deadly.", "Monitor stations watch active ones.", "Magma chambers feed it.", "Volcanic islands form in the ocean.", "Pompeii's ruins are near one.", "Geothermal energy comes from them.", "They form at tectonic boundaries.", "Mount St. Helens erupted in 1980.", "It has seven letters."] },
    { word: "Trampoline", hints: ["You bounce on it.", "It is used for fun.", "Gymnasts train on it.", "It has a stretchy surface.", "It has springs.", "It sits on a metal frame.", "Backyard versions are common.", "It can be dangerous.", "Flips are done on it.", "Olympic athletes use it.", "Safety nets surround some.", "Children love it.", "It provides great exercise.", "It was originally a training tool.", "Competitive versions are very bouncy.", "Parks have indoor ones.", "Jumping parks feature many.", "It launches you into the air.", "It was invented in the 1930s.", "It has ten letters."] },
    { word: "Pineapple", hints: ["It is a tropical fruit.", "It has a rough, spiky exterior.", "It is yellow inside.", "It is sweet and tangy.", "It is used on pizza controversially.", "It has a crown of leaves.", "It grows from plants near the ground.", "Hawaii is famous for growing it.", "It is juiced for drinks.", "It contains bromelain enzyme.", "It is a symbol of hospitality.", "It takes years to grow one.", "It is in the bromeliad family.", "Dole is a famous brand.", "It can be canned or fresh.", "It tastes great in smoothies.", "It has no relation to pine or apples.", "It is used in tropical dishes.", "Upside-down cakes feature it.", "It has nine letters."] },
    { word: "Scissors", hints: ["It is a tool.", "It cuts things.", "It has two blades.", "It has handles.", "It opens and closes.", "Paper is commonly cut by it.", "Barbers use them on hair.", "Fabric is cut with it.", "Children use safety versions.", "Rock-paper-scissors features it.", "It has a pivot in the middle.", "Kitchen shears are a type.", "It is found in every home.", "Left-handed versions exist.", "It is sharp.", "Craft projects need it.", "Surgeons use special versions.", "It can cut cardboard.", "It is usually made of steel.", "The word has eight letters."] },
    { word: "Earthquake", hints: ["The ground shakes.", "Buildings can collapse.", "It is a natural disaster.", "The Richter scale measures it.", "Tectonic plates cause it.", "Aftershocks follow the main one.", "Japan experiences many.", "San Francisco had a famous one.", "Fault lines are where they occur.", "Seismographs detect them.", "They can trigger tsunamis.", "Buildings sway during one.", "Drop, cover, hold on is advice.", "They last seconds to minutes.", "The epicenter is above the focus.", "Liquefaction can occur.", "Infrastructure can be destroyed.", "They happen without warning.", "California's San Andreas fault causes many.", "The word has ten letters."] },
    { word: "Panda", hints: ["It is a bear.", "It is black and white.", "It eats bamboo.", "It lives in China.", "It is a symbol of conservation.", "It is very cute.", "WWF uses it as its logo.", "It is endangered.", "It sleeps a lot.", "Baby ones are very tiny at birth.", "It has a pseudo-thumb.", "It lives in mountain forests.", "It is gentle and shy.", "Zoos around the world have them.", "It eats for many hours a day.", "It is solitary.", "China loans them to other countries.", "It has a round face.", "It does not hibernate.", "It has five letters."] },
    { word: "Harmonica", hints: ["It is a musical instrument.", "You blow into it.", "It is small and portable.", "It is used in blues music.", "It has many small holes.", "It can play melodies and chords.", "Bob Dylan played one.", "It fits in your pocket.", "It is also called a mouth organ.", "It has metal reeds.", "You can bend notes on it.", "It is easy to start learning.", "It comes in different keys.", "Country music uses it.", "It was invented in the early 1800s.", "Campfire songs often feature it.", "It can produce a wailing sound.", "It is inexpensive.", "Hohner is a famous brand.", "It has nine letters."] },
    { word: "Lighthouse", hints: ["It stands by the sea.", "Its beam guides ships.", "It warns of rocky shores.", "It is tall and narrow.", "A keeper once operated it.", "It flashes light at intervals.", "It saves lives at sea.", "Many are painted with stripes.", "It is built to withstand storms.", "Some are on small islands.", "It has a lantern room at the top.", "Fresnel lenses focus its light.", "It is a maritime landmark.", "Some are now museums.", "Its light can be seen miles away.", "Fog signals accompany many.", "It has been used since ancient times.", "Pharos of Alexandria was an ancient one.", "Postcards often feature it.", "It has ten letters."] },
    { word: "Volcano", hints: ["It is a vent in Earth's crust.", "Molten rock escapes from it.", "It can be explosive.", "Volcanic ash spreads far.", "Mount Pinatubo erupted massively.", "Hot springs form near it.", "Lava hardens into rock.", "Some create cone shapes.", "Others form flat shield shapes.", "Eruptions can affect climate.", "Ancient Romans feared Vesuvius.", "Iceland sits on a volcanic ridge.", "Geologists monitor active ones.", "Some erupt underwater.", "They release sulfur dioxide.", "Volcanic soil is very fertile.", "They can be thousands of feet tall.", "Calderas are collapsed craters.", "Tectonic plate boundaries have most.", "It has seven letters."] },
    { word: "Telescope", hints: ["It helps you see far away.", "It uses magnification.", "It has a tube shape.", "Stars become visible through it.", "Galileo improved an early version.", "Refracting types use lenses.", "Reflecting types use mirrors.", "The Hubble orbits Earth.", "Observatories have giant ones.", "It reveals craters on the Moon.", "It can show Saturn's rings.", "Amateur stargazers use small ones.", "It needs a clear sky.", "Light pollution affects it.", "A finderscope helps aim it.", "Magnification power varies.", "It can be computerized.", "It tracks objects across the sky.", "The James Webb sees infrared.", "It has nine letters."] },
    { word: "Elephant", hints: ["It never forgets.", "It sprays water with its trunk.", "Its ears help cool its body.", "It communicates through vibrations.", "Herds are led by a matriarch.", "It is endangered by poaching.", "It plays in mud.", "African ones are larger than Asian ones.", "It uses dust to protect its skin.", "Baby ones stand within minutes.", "It mourns its dead.", "It has the largest brain of land animals.", "Ivory trade threatens it.", "It strips bark from trees.", "It can run surprisingly fast.", "It eats hundreds of pounds daily.", "It has poor eyesight.", "It recognizes itself in mirrors.", "It lives in savannas and forests.", "It has eight letters."] },
    { word: "Calendar", hints: ["It tracks days and months.", "It is on your wall.", "It has 12 months.", "It shows the year.", "It marks holidays.", "Digital ones are on phones.", "January starts most of them.", "It helps organize schedules.", "Leap year adds a day.", "It was reformed by Pope Gregory.", "The Mayan one was very accurate.", "It shows weeks in rows.", "Some start on Sunday, others Monday.", "Advent versions count to Christmas.", "It is printed annually.", "It has 365 or 366 days.", "Each month has its own page.", "Chinese New Year follows a different one.", "It is essential for planning.", "It has eight letters."] },
    { word: "Satellite", hints: ["It floats in space.", "It circles a planet.", "Artificial ones are man-made.", "They carry cameras.", "They transmit TV signals.", "GPS relies on many.", "They orbit at different heights.", "They monitor weather.", "Solar panels provide power.", "They travel thousands of miles per hour.", "Space debris threatens them.", "SpaceX launches many.", "They cost millions to build.", "Ground stations communicate with them.", "They can spy on locations.", "Geostationary ones stay over one spot.", "Starlink provides internet through them.", "They burn up on reentry.", "Hubble is a space telescope one.", "It has nine letters."] },
    { word: "Microscope", hints: ["Scientists use it daily.", "It reveals cells and bacteria.", "Compound ones use multiple lenses.", "A stage holds the specimen.", "It has a light source below.", "It can magnify 1000 times or more.", "Phase contrast versions see living cells.", "Medical labs rely on it.", "Blood samples are examined with it.", "It has coarse and fine focus.", "Oil immersion increases detail.", "Robert Hooke named cells using one.", "It can reveal parasites.", "Digital ones display on screens.", "It is essential in pathology.", "Viruses need electron versions.", "It has objective lenses of varying power.", "Cover slips protect specimens.", "It changed medicine forever.", "It has ten letters."] },
    { word: "Butterfly", hints: ["It emerges from a chrysalis.", "Its wings are symmetrical.", "It migrates thousands of miles.", "Monarch ones are orange and black.", "It sips nectar through a tube.", "It was once a caterpillar.", "It has compound eyes.", "Its lifespan varies by species.", "It uses wings to regulate temperature.", "It tastes with its feet.", "Rare ones are collected.", "It pollinates flowers.", "It is a symbol of change.", "Painted Lady is a common type.", "Its scales create wing colors.", "It basks in sunlight.", "It avoids rain.", "Some look like leaves.", "Morpho ones are bright blue.", "It has nine letters."] },
    { word: "Treasure", hints: ["Adventurers seek it.", "Maps sometimes lead to it.", "It represents great wealth.", "Shipwrecks may hold it.", "Historical artifacts can be it.", "It can be gold or gems.", "It is associated with mystery.", "National treasures are protected.", "Treasure Island is a famous book.", "Real ones have been found by divers.", "Legends surround hidden ones.", "It can be cultural or monetary.", "Some is in bank vaults.", "Archaeology uncovers ancient ones.", "It can be sentimental too.", "Crown jewels are treasured.", "Finding it brings excitement.", "It has been fought over.", "Metal detecting can reveal small ones.", "It has eight letters."] },
    { word: "Scorpion", hints: ["It is an arachnid.", "It has a venomous stinger.", "It has pincers.", "It lives in deserts.", "It glows under UV light.", "It is nocturnal.", "It has eight legs.", "Baby ones ride on the mother.", "It has been around for 400 million years.", "Some stings are dangerous.", "Emperor ones are large.", "It hides under rocks.", "It catches prey with pincers.", "It has a segmented tail.", "It is related to spiders.", "It is found on every continent except Antarctica.", "It can survive without food for months.", "Deathstalker is one of the most venomous.", "Ancient Egyptians worshipped one.", "It has eight letters."] },
    { word: "Notebook", hints: ["You write in it.", "It has pages.", "Students carry one.", "It can be spiral or bound.", "It stores notes.", "It has lines or grids.", "It can have a cover.", "Moleskine makes famous ones.", "Journalists use them.", "It fits in a backpack.", "Sketches go in it too.", "It is made of paper.", "It comes in many sizes.", "Composition books are a type.", "It is a staple school supply.", "Ideas are recorded in it.", "It can be plain or decorated.", "Bullet journaling uses it.", "A computer version also exists.", "It has eight letters."] },
    { word: "Volcano", hints: ["Its eruptions shape landscapes.", "It spews lava and ash.", "Pompeii was buried by one.", "Some are under the ocean.", "Ring of Fire is a belt of them.", "Magma rises to the surface.", "Craters form at the top.", "Shield ones have gentle slopes.", "Cinder cone ones are small.", "Composite ones are the tallest.", "Mt. Kilimanjaro is one.", "Yellowstone is a supervolcano.", "Volcanic glass is called obsidian.", "Tuff is a volcanic rock.", "They build new land.", "Gases like CO2 escape from them.", "Lava tubes form during eruptions.", "Volcanic lightning can occur.", "They are found on other planets too.", "It has seven letters."] },
    { word: "Dolphin", hints: ["It leaps out of the water.", "It lives in groups.", "It is warm-blooded.", "It uses echolocation.", "Spinner ones spin in the air.", "It is found in every ocean.", "It is a cetacean.", "It nurses its young.", "It has a smooth skin.", "It has flippers.", "It sleeps with one eye open.", "It can be trained.", "It has over 40 species.", "Some live in rivers.", "It plays with seaweed.", "It bowrides near boats.", "It is a symbol of the sea.", "It helps fishermen in some cultures.", "Orca is a large relative.", "It has seven letters."] },
    { word: "Hamburger", hints: ["It is a food.", "It is eaten with hands.", "A bun holds it together.", "It contains a meat patty.", "Ketchup and mustard are common toppings.", "Fast food chains sell millions.", "It is an American classic.", "It can have cheese on it.", "Lettuce and tomato are common additions.", "McDonald's is famous for selling it.", "It can be grilled or fried.", "It is usually beef.", "It was named after a German city.", "Veggie versions exist.", "It is served at barbecues.", "Double ones have two patties.", "Pickles are a popular addition.", "Sliders are small versions.", "It is a casual meal.", "It has nine letters."] },
    { word: "Parachute", hints: ["It slows your fall.", "It is made of fabric.", "Skydivers use it.", "It opens in the air.", "It catches wind.", "A ripcord deploys it.", "It is a safety device.", "Military forces use it.", "It allows safe landing.", "It has a round or rectangular canopy.", "It was first used around 1797.", "Paratroopers depend on it.", "It folds into a backpack.", "Drag slows descent with it.", "A reserve one is a backup.", "Tandem jumps use one for two people.", "It has strings called suspension lines.", "BASE jumpers use it.", "It must be packed very carefully.", "It has nine letters."] },
    { word: "Snowman", hints: ["It is made in winter.", "It is made of snow.", "It has a carrot nose.", "It has coal eyes.", "It wears a scarf.", "It has a top hat.", "It has stick arms.", "Children build it.", "Frosty is a famous one.", "It melts when it gets warm.", "It has three round sections.", "It stands in the yard.", "It needs fresh snow.", "A button row decorates it.", "It is a symbol of winter fun.", "Olaf from Frozen is one.", "It can hold a broom.", "It brings joy to families.", "It is temporary art.", "It has seven letters."] },
    { word: "Lighthouse", hints: ["Mariners watch for it.", "It is built on coasts.", "Its rotating light shines far.", "It marks dangerous areas.", "It is usually cylindrical.", "Atlantic coast has many.", "Keepers lived in them.", "It is painted distinctly.", "Some are very old.", "It is a beacon.", "It is found on stamps.", "Its light has a pattern.", "Erosion threatens coastal ones.", "It is picturesque.", "Some are open to visitors.", "It guides boats home.", "It is associated with safety.", "Foghorns sound from it.", "Its lamp uses a Fresnel lens.", "It has ten letters."] },
    { word: "Skeleton", hints: ["It holds up your body.", "It has over 200 bones.", "The skull protects the brain.", "It includes the spine.", "It has a ribcage.", "It is studied in anatomy.", "Joints allow it to move.", "Cartilage cushions its joints.", "It determines your height.", "It stores minerals.", "It makes blood in marrow.", "You are born with 270 parts.", "By adulthood some fuse together.", "It can show signs of disease.", "Forensics uses it to identify people.", "The pelvis reveals gender.", "It supports all muscles.", "It is flexible yet strong.", "It is the body's framework.", "It has eight letters."] },
    { word: "Igloo", hints: ["It is a shelter.", "It is made of snow blocks.", "It is dome-shaped.", "Inuit people build it.", "It is warm inside despite being made of ice.", "It is found in the Arctic.", "Body heat warms its interior.", "It blocks cold wind.", "It has a low entrance tunnel.", "It can house a family.", "It is a temporary structure.", "Snow insulates it.", "It takes skill to build.", "A ventilation hole prevents suffocation.", "Oil lamps can heat it.", "Its walls can be several feet thick.", "Modern ones are built for fun.", "Survival courses teach how to build it.", "It keeps the cold out.", "It has five letters."] },
    { word: "Skateboard", hints: ["You ride it.", "It has four wheels.", "It is a wooden deck.", "Tricks are performed on it.", "It originated in California.", "Kickflips are a common trick.", "It is used in skate parks.", "Tony Hawk is legendary at it.", "It has trucks underneath.", "Grip tape covers the top.", "It can be used for transportation.", "Ollies are a basic move.", "It was inspired by surfing.", "It is part of street culture.", "It is in the Olympics.", "Half-pipes are ramps for it.", "It requires balance.", "Bearings make the wheels spin.", "It can do grinds on rails.", "It has ten letters."] },
    { word: "Rainbow", hints: ["It arcs across the sky.", "It appears after a storm.", "It results from light refraction.", "Seven colors make it up.", "ROY G BIV helps remember its colors.", "It is a semicircle.", "You cannot reach its end.", "Mythology connects it to treasure.", "Noah saw one after the flood.", "Double ones have reversed colors.", "It needs rain and sunshine.", "It is a promise of hope.", "Prisms create a miniature version.", "It is visible for a short time.", "It forms opposite the sun.", "Water droplets act as prisms.", "It is beautiful and fleeting.", "Full circles are seen from planes.", "It is a universal symbol.", "It has seven letters."] },
    { word: "Cactus", hints: ["It thrives in dry conditions.", "Its spines protect it.", "It stores water in its body.", "Some produce colorful flowers.", "Prickly pear is an edible type.", "It can live for decades.", "Its roots spread wide.", "It has adapted to heat.", "Some are tiny, some are enormous.", "Barrel types are round.", "Organ pipe ones grow in clusters.", "It photosynthesizes through its stem.", "Night-blooming types flower in the dark.", "It is a symbol of the desert.", "It rarely needs watering indoors.", "Some have fuzzy-looking spines.", "Birds nest in large ones.", "It has a waxy coating.", "It is surprisingly diverse.", "It has six letters."] },
    { word: "Diamond", hints: ["It is the birthstone of April.", "It is used in drill bits.", "It conducts heat very well.", "It is graded by cut clarity color carat.", "It forms deep underground.", "It is made of pure carbon.", "Kimberlite pipes bring it to surface.", "Lab-grown ones are an alternative.", "It has exceptional brilliance.", "The Cullinan is the largest rough one found.", "It symbolizes everlasting love.", "Engagement rings commonly feature it.", "It refracts light into rainbows.", "Industrial ones are used for cutting.", "Blood diamonds fund conflicts.", "It takes billions of years to form.", "De Beers popularized it for weddings.", "It is nearly indestructible.", "It is transparent when pure.", "It has seven letters."] },
    { word: "Telescope", hints: ["It extends vision.", "Refracting ones bend light.", "Reflecting ones bounce light.", "A mount holds it steady.", "Dobsonian mounts are popular.", "CCD sensors capture images through it.", "Astrophotography uses it.", "Deep-sky objects become visible.", "Nebulae are revealed by it.", "Galaxies are photographed through it.", "A guide scope helps track objects.", "Aperture determines light-gathering power.", "It can have goto tracking.", "Eyepieces swap for different magnification.", "Collimation aligns its mirrors.", "It opens the universe to us.", "Radio versions detect invisible waves.", "Space versions avoid atmospheric distortion.", "They range from toy to professional.", "It has nine letters."] },
    { word: "Airplane", hints: ["It defies gravity.", "Wings generate lift.", "Jet fuel powers most.", "A cabin holds passengers.", "In-flight movies entertain.", "The cockpit is at the front.", "Radar guides its path.", "Altitude is measured in feet.", "A control tower guides takeoff.", "Black boxes record flight data.", "Air traffic controllers manage it.", "Turbulence happens in rough air.", "Oxygen masks drop in emergencies.", "It pressurizes at altitude.", "It travels at hundreds of mph.", "Boeing and Airbus build them.", "It changed global travel.", "It can cross oceans.", "Some are supersonic.", "It has eight letters."] },
    { word: "Calculator", hints: ["It does math.", "It has number buttons.", "It shows results on a screen.", "It can add subtract multiply divide.", "Students use it in school.", "Scientific ones handle complex functions.", "Graphing ones plot equations.", "It replaced the abacus for many.", "It runs on battery or solar.", "It is small and portable.", "It was invented in the 1960s.", "Texas Instruments makes popular ones.", "Casio is another famous brand.", "It saves time on calculations.", "Accountants rely on it.", "Phone apps can simulate it.", "It has memory functions.", "It can calculate percentages.", "It is found in every office.", "It has ten letters."] },
    { word: "Penguin", hints: ["It thrives in cold oceans.", "Its feathers are tightly packed.", "It porpoises through water.", "Emperor ones endure Antarctic winters.", "Blue ones are the smallest.", "It can dive hundreds of feet deep.", "Its diet is mainly fish and krill.", "It regurgitates food for chicks.", "It calls loudly to find its mate.", "Colonies can have thousands.", "It cannot breathe underwater.", "It is torpedo-shaped for swimming.", "It has a layer of fat.", "Adélie and chinstrap are species.", "Macaroni ones have yellow crests.", "It has been in many animations.", "It is not found in the Arctic.", "It has existed for millions of years.", "Its predators include leopard seals.", "It has seven letters."] },
    { word: "Volcano", hints: ["Its eruptions can darken skies.", "Lahars are volcanic mudflows.", "Tephra is ejected material.", "Pumice is a volcanic rock that floats.", "Volcanic islands grow over time.", "Kilauea has erupted often.", "Piton de la Fournaise is very active.", "Gas emissions can be toxic.", "Eruption columns can reach miles high.", "Volcanic winter can follow big eruptions.", "AA and pahoehoe are lava types.", "Monitoring includes seismometers.", "Tilt meters detect swelling.", "Evacuation zones surround active ones.", "Volcanic soil grows great coffee.", "Obsidian was used for ancient tools.", "Volcanic glass has sharp edges.", "Some civilizations worshipped them.", "They release Earth's internal heat.", "It has seven letters."] },
    { word: "Helicopter", hints: ["Its blades spin above.", "It can fly in any direction.", "It hovers at a fixed point.", "It is used for medical transport.", "It can land almost anywhere.", "News crews film from it.", "It has a tail rotor for stability.", "Black Hawk is a military model.", "It can carry cargo on a line.", "It is used for search and rescue.", "Traffic reports come from it.", "Tour companies fly tourists in it.", "It can fly low to the ground.", "Coast Guard uses it at sea.", "It is used for firefighting.", "It has a limited range compared to planes.", "Robinson makes popular light ones.", "VIPs use it for fast travel.", "It is used in construction.", "It has ten letters."] },
    { word: "Sunflower", hints: ["Its head follows the sun.", "It is native to North America.", "Its seeds contain healthy oils.", "It is planted in rows in fields.", "Bees are attracted to it.", "It can grow taller than a person.", "Its petals are bright yellow.", "The center disk has hundreds of tiny flowers.", "Sunflower oil is used for cooking.", "It withers in fall.", "It needs full sun.", "Hamsters eat its seeds.", "Its stems are thick and hairy.", "It is both ornamental and agricultural.", "Teddy Bear is a dwarf variety.", "It can self-pollinate.", "It starts drooping when seeds ripen.", "It is cheerful and iconic.", "Kansas is the sunflower state.", "It has nine letters."] },
    { word: "Dinosaur", hints: ["Their era lasted 165 million years.", "Fossils are found worldwide.", "T-Rex had tiny arms.", "Brachiosaurus had a long neck.", "Stegosaurus had plates on its back.", "Pterodactyls flew but are not technically one.", "Eggs have been fossilized.", "Footprints are preserved in rock.", "Some weighed over 70 tons.", "Some were as small as chickens.", "They went extinct 66 million years ago.", "The Chicxulub impact likely ended them.", "They came in all sizes.", "Many ate plants.", "Raptors hunted in packs.", "Amber preserved their era's insects.", "Their names come from Greek and Latin.", "New species are still discovered.", "They lived on every continent.", "The word has eight letters."] },
    { word: "Umbrella", hints: ["It shields you from rain.", "It collapses for storage.", "It has a curved or straight handle.", "Its canopy is usually nylon.", "Wind can invert it.", "Compact ones fit in a purse.", "Golf ones are extra large.", "Some have UV protection.", "It has a shaft and ribs.", "It is one of the oldest inventions.", "Clear ones let you see through.", "Automatic ones open with a button.", "It is a fashion accessory.", "Doormen hold them for guests.", "The Rihanna song features it.", "It is bad luck to open indoors.", "It comes in endless patterns.", "A brolly is British slang for it.", "It is cheap to buy.", "It has eight letters."] },
    { word: "Kangaroo", hints: ["It is found only in Australia.", "Its young develop in a pouch.", "It can leap great distances.", "Its hind feet are huge.", "It uses its tail as a third leg.", "Boxing matches have featured them.", "They travel in mobs.", "Grey ones are common in cities.", "Tree species live in rainforests.", "National parks protect them.", "They graze at dawn and dusk.", "Their pouches face forward.", "A joey attaches to a teat.", "Males fight for mates.", "Wallabies are smaller relatives.", "It appears on road warning signs.", "Farmers consider them pests.", "They are hunted for meat and leather.", "Their population is in the millions.", "It has eight letters."] },
    { word: "Guitar", hints: ["It is a beloved instrument.", "Pop music features it heavily.", "Power chords drive rock songs.", "It can be steel-string or nylon.", "Tabs help beginners learn.", "A tuner keeps it in pitch.", "Its body amplifies sound.", "A sound hole projects acoustic volume.", "Fingerpicking is a playing style.", "Slash is famous for playing it.", "Blues relies on it.", "12-string versions have a richer sound.", "A strap supports it while standing.", "Distortion pedals modify its tone.", "It is in virtually every band.", "It originated centuries ago.", "The bridge holds its strings.", "Harmonics create bell-like tones.", "Open tunings change its sound.", "It has six letters."] },
    { word: "Avalanche", hints: ["Snow rushes down slopes.", "Triggers include wind and warmth.", "It can travel over 100 mph.", "Rescue beacons help find victims.", "Probing is part of rescue.", "It can carry millions of tons of snow.", "Slab type is the most dangerous.", "Weak layers in snowpack cause it.", "Airbag packs help survival.", "Backcountry skiing risks it.", "Snowmobiles can trigger one.", "Couloirs channel its flow.", "Warning signs are posted.", "Forecasters rate daily danger.", "Terrain traps increase risk.", "Education is key to prevention.", "Escape routes should be planned.", "Tree-covered slopes reduce risk.", "Transceiver shovel probe are essential gear.", "It has nine letters."] },
    { word: "Crocodile", hints: ["It lurks in rivers.", "It can remain motionless for hours.", "Its bite force is immense.", "It is a cold-blooded predator.", "Saltwater ones are the largest.", "It builds nests for eggs.", "Temperature determines the sex of offspring.", "It has armored scales.", "It can gallop on land.", "It tears food by spinning.", "It has been worshipped in cultures.", "Its tears are a famous phrase.", "It can go months without eating.", "It ambushes prey at the waterline.", "Gharials are a relative.", "It is protected in many countries.", "It communicates with bellows.", "Nesting mothers guard aggressively.", "It has excellent night vision.", "It has nine letters."] },
    { word: "Firework", hints: ["It illuminates night celebrations.", "Chemicals create its colors.", "Barium makes green.", "Copper makes blue.", "Strontium makes red.", "It is timed by fuses.", "Shells are launched from mortar tubes.", "Professional displays are synchronized.", "Music often accompanies it.", "It can represent patriotism.", "Safety distances are required.", "It has been used for centuries.", "Chinese New Year features them.", "Diwali celebrations include it.", "It can frighten animals.", "Sparklers are the simplest form.", "Grand finales are the most spectacular.", "It produces chemical reactions.", "Environmental concerns surround it.", "It has eight letters."] },
    { word: "Hurricane", hints: ["It is a powerful storm.", "It forms over warm ocean water.", "It has an eye at the center.", "Winds exceed 74 mph.", "It rotates counterclockwise in the Northern Hemisphere.", "The Saffir-Simpson scale rates it.", "Storm surge floods coasts.", "It is also called a typhoon or cyclone.", "It weakens over land.", "Category 5 is the strongest.", "It can be hundreds of miles wide.", "It causes massive destruction.", "Hurricane season lasts months.", "It is tracked by satellites.", "Names are assigned alphabetically.", "Katrina was devastating.", "Evacuation is often necessary.", "Bands of rain spiral outward.", "It loses strength without warm water.", "It has nine letters."] },
    { word: "Octopus", hints: ["It has a soft body.", "Each arm can act independently.", "It escapes through tiny openings.", "It regenerates lost arms.", "It is a master of disguise.", "It builds dens from rocks.", "Female ones die after eggs hatch.", "It tastes with its suckers.", "It is eaten in many cultures.", "It can jet propel itself.", "It is related to squids.", "It has a large brain for its size.", "It can use tools.", "Mimic ones imitate other animals.", "Giant Pacific ones can span 16 feet.", "It has no shell.", "It navigates mazes.", "Its ink clouds water to escape.", "It is a predator of crabs.", "It has seven letters."] },
    { word: "Passport", hints: ["It is essential for tourism.", "It is a travel document.", "It contains biometric data.", "Visa stamps fill its pages.", "It has a chip in newer versions.", "Countries design them differently.", "Some are more powerful than others.", "Dual citizenship means having two.", "Customs officers scan it.", "It verifies your identity abroad.", "Losing it requires embassy help.", "It has an issue and expiry date.", "Photo requirements are strict.", "You cannot board international flights without it.", "Global entry is linked to it.", "Diplomatic ones grant special privileges.", "It is kept in a secure place.", "Children need their own.", "It takes weeks to process.", "It has eight letters."] },
    { word: "Calendar", hints: ["It helps plan ahead.", "Months are divided into weeks.", "Appointments are written on it.", "Digital ones sync across devices.", "Gregorian is the most common type.", "Lunar ones follow the Moon.", "It resets each year.", "Birthdays are marked on it.", "Holidays are highlighted.", "It hangs on kitchen walls.", "Desk ones sit beside computers.", "It has evolved over centuries.", "Planners are pocket versions.", "Shared ones coordinate teams.", "It has rows and columns.", "Reminder alerts come from digital ones.", "A fiscal year starts differently.", "Academic ones start in September.", "It drives scheduling.", "It has eight letters."] },
    { word: "Submarine", hints: ["It travels underwater.", "It is a type of vessel.", "It has a periscope.", "Navy forces use it.", "It can dive deep.", "It is shaped like a cylinder.", "Nuclear ones can stay submerged for months.", "Torpedoes are launched from it.", "Sonar detects it.", "Ballast tanks control its depth.", "Crew lives in tight quarters.", "It carries missiles.", "U-boats were German versions.", "It surfaces to communicate sometimes.", "Oxygen is recycled inside.", "It was used in both world wars.", "Jules Verne wrote about one.", "Yellow Submarine is a famous song.", "It can be very long.", "It has nine letters."] },
    { word: "Scorpion", hints: ["It stalks at night.", "UV light reveals it.", "It lives under rocks by day.", "Its tail curves over its back.", "It uses venom to subdue prey.", "Most stings are painful not fatal.", "It dances during mating.", "It carried babies on its back.", "It is found in warm climates.", "Arizona has many.", "Ancient Egyptians had a goddess of one.", "It breathes through book lungs.", "It eats insects and spiders.", "It can survive freezing.", "It is solitary.", "Bark ones are the most dangerous in the US.", "It has been around since the Silurian period.", "It fluoresces blue-green.", "Its chelae are its claws.", "It has eight letters."] },
    { word: "Snowflake", hints: ["Each one is unique.", "It is symmetrical.", "It has six arms.", "Temperature affects its shape.", "Wilson Bentley first photographed them.", "It starts as a crystal.", "Dendrite types are star-shaped.", "Column types are like tiny pillars.", "Plate types are flat and thin.", "They clump together as they fall.", "Humidity affects their growth.", "They form in supercooled clouds.", "No two are provably identical.", "They range from tiny to large.", "Stellar ones are the most intricate.", "They melt instantly on warm surfaces.", "They accumulate into snowpack.", "Heavy snowfall can be called a whiteout.", "They are studied in crystallography.", "It has nine letters."] },
    { word: "Telescope", hints: ["Newton designed a reflecting type.", "Cassegrain types use two mirrors.", "Schmidt-Cassegrain combines designs.", "It needs dark skies.", "Tracking motors follow stars.", "Focal length determines magnification.", "Achromatic lenses reduce color fringing.", "Adaptive optics correct for atmosphere.", "Interferometry links multiple ones.", "Arrays of radio ones create giant dishes.", "It has changed our view of the cosmos.", "Ancient Greeks wanted one.", "It probed the Big Bang's remnants.", "Exoplanets have been found with it.", "Spectroscopy uses it to study light.", "It can measure star distances.", "Photographic plates recorded early views.", "CCD chips replaced film for it.", "It looks billions of years back.", "It has nine letters."] },
    { word: "Giraffe", hints: ["Its neck has only seven vertebrae.", "Each vertebra is very long.", "Its legs are about six feet.", "It has a prehensile tongue.", "It browses acacia trees.", "Its pattern is like a fingerprint.", "Reticulated ones have neat pattern blocks.", "Masai ones have jagged patches.", "It rarely lies down.", "It gives birth standing up.", "Calves drop six feet at birth.", "It can kick a lion to death.", "Its blood pressure is very high.", "It has special valves in its neck.", "It sleeps about 30 minutes a day.", "Males fight by swinging necks.", "It runs in a galloping gait.", "Oxpecker birds clean its skin.", "Its population is declining.", "It has seven letters."] },
    { word: "Hamburger", hints: ["Ground beef is the key ingredient.", "It is served hot.", "It was popularized at a world fair.", "White Castle was an early chain.", "Slider versions are small.", "Wagyu versions are premium.", "In-N-Out popularized fresh ones.", "Smashburgers press the patty flat.", "Medium rare is a popular level.", "Cheese melts on top.", "Brioche buns are gourmet.", "Condiments vary by country.", "It is a billion-dollar industry.", "It is grilled, fried, or charbroiled.", "It can be turkey or chicken.", "Plant-based patties mimic it.", "Five Guys is famous for them.", "It was not invented in Hamburg.", "National hamburger day is in May.", "It has nine letters."] },
    { word: "Chameleon", hints: ["Its skin cells contain pigment.", "It changes color rapidly.", "It can be calm or stressed.", "Its tongue shoots out in milliseconds.", "Its eyes rotate 360 degrees.", "It is mostly found in Africa.", "Jackson's type has three horns.", "Veiled ones are common pets.", "Panther ones are very colorful.", "It clings to branches.", "Its toes are fused in groups.", "It moves with a rocking motion.", "Males display brighter colors.", "Females may darken when gravid.", "UVB light is essential for pet ones.", "It drinks water droplets.", "It is territorial.", "Its tail is prehensile.", "It is a sit-and-wait predator.", "It has nine letters."] },
    { word: "Parachute", hints: ["It creates drag.", "Round ones have been replaced by rectangles.", "Steering toggles control direction.", "A deployment bag holds it.", "Static lines deploy some automatically.", "Terminal velocity is reached before opening.", "AAD devices auto-deploy in emergencies.", "RAM air ones glide forward.", "Tandem setups carry two people.", "Sport jumpers use it for precision.", "BASE jumping uses it at low altitudes.", "D-Bag deployment is standard.", "Packing takes 15-20 minutes.", "Riggers inspect and repack reserves.", "Canopy piloting is an advanced sport.", "Cutaway handles detach a malfunctioning one.", "Wingsuit flyers deploy it to land.", "Military uses T-11 models.", "Competition accuracy targets a disc.", "It has nine letters."] },
    { word: "Flamingo", hints: ["It filters feed through its beak.", "It is born white or gray.", "Shrimp and algae give it color.", "It can sleep standing up.", "One leg stance conserves heat.", "It lives near salt lakes.", "Andean ones live at high altitudes.", "It nests in mudflat colonies.", "Both parents feed the chick.", "Its honking fills wetlands.", "It has webbed feet.", "Greater ones are the largest.", "Lesser ones are the most numerous.", "Its beak is uniquely shaped.", "It occurs naturally in the Americas, Africa, and Europe.", "Zoo populations are kept by wing clipping.", "Ancient Egyptians considered it sacred.", "Flamingo tongue snails are also named after it.", "Flamboyance is the group name.", "It has eight letters."] },
    { word: "Pineapple", hints: ["It takes 2-3 years to grow.", "It does not grow on a tree.", "Each plant produces one fruit.", "The crown can be replanted.", "It was a luxury in 18th-century Europe.", "It tenderizes meat due to enzymes.", "Eating too much numbs your mouth.", "It is grown in tropical regions.", "Costa Rica is a top producer.", "Canned versions are common.", "It is used in Asian cooking.", "It symbolized wealth and status.", "Architecture featured it as decoration.", "Rum drinks often include it.", "It can cause tongue irritation.", "Dried versions are a snack.", "It is acidic.", "It pairs with ham.", "Golden variety is extra sweet.", "It has nine letters."] },
    { word: "Skateboard", hints: ["Plywood layers form its deck.", "Urethane wheels replaced clay ones.", "Trucks connect wheels to deck.", "Street skating uses urban features.", "Vert skating uses ramps.", "Parks are designed specifically for it.", "Protective gear prevents injuries.", "It became mainstream in the 1970s.", "Z-Boys transformed it.", "Video games made it more popular.", "It was added to the Olympics in 2020.", "Decks come in various widths.", "Concave shapes help with tricks.", "Wax reduces friction on edges.", "A nose manual balances on the front.", "Nollie means popping the nose.", "Switch is riding in the opposite stance.", "It has a vibrant subculture.", "Shoe companies sponsor riders.", "It has ten letters."] },
    { word: "Hospital", hints: ["Emergency rooms treat urgent cases.", "ICUs care for the most critical.", "Surgeons operate in sterile rooms.", "X-ray and MRI machines are there.", "Pharmacies dispense medications.", "Blood banks store donations.", "Maternity wards deliver babies.", "Patients wear gowns.", "Cafeterias feed staff and visitors.", "Chaplains offer spiritual support.", "Lab results guide treatment.", "Ambulances arrive frequently.", "Triage prioritizes patients.", "Shift rotations cover 24 hours.", "Rehabilitation departments aid recovery.", "Infection control is critical.", "Electronic records track patient data.", "Specialists consult on complex cases.", "Billing departments handle costs.", "It has eight letters."] },
    { word: "Hurricane", hints: ["Its eye is calm.", "Eye wall has the strongest winds.", "Storm surge can be over 20 feet.", "Rain bands spiral outward.", "Warm ocean water fuels it.", "It weakens over cool water.", "Coriolis effect curves its spin.", "Tropical depression is its weakest form.", "Tropical storm is the next stage.", "Saffir-Simpson rates one to five.", "It is named by meteorological organizations.", "Tracking models predict its path.", "Landfall is when it hits shore.", "Flooding causes the most deaths.", "Wind damage is widespread.", "Power outages last days or weeks.", "FEMA responds to major ones.", "Insurance costs rise after them.", "Climate change may intensify them.", "It has nine letters."] },
    { word: "Trampoline", hints: ["Its mat is woven polyester.", "Springs store elastic energy.", "Tuck jumps are a basic skill.", "Pike jumps extend the legs.", "Straddle jumps spread the legs.", "Competitive routines have ten bounces.", "Judges score form and height.", "Double mini is a competition event.", "Tumbling tracks use it for power.", "It improves coordination.", "NASA studied it for astronaut training.", "It rehabilitates injuries.", "Fitness classes use small ones.", "It builds core strength.", "Netting prevents falls.", "Spring-free designs use rods instead.", "Weight limits apply.", "Supervision is recommended for children.", "Olympic scoring is precise.", "It has ten letters."] },
    { word: "Submarine", hints: ["Its hull withstands deep pressure.", "Ballast tanks flood to dive.", "Compressed air blows tanks to surface.", "Nuclear reactors power modern ones.", "Crew serves for months.", "Periscope is used near the surface.", "It carries ballistic missiles.", "It can remain silent to avoid detection.", "Sonar is its primary sensor.", "It maintains air quality mechanically.", "Fresh water is made from seawater.", "Crew sleep in bunks.", "Attack versions hunt enemy ships.", "Diesel-electric ones are quieter.", "It communicates via very low frequency.", "Depth charges were historical threats.", "Emergency surfacing is a drill.", "Torpedo tubes launch weapons.", "Class designations identify models.", "It has nine letters."] },
    { word: "Waterfall", hints: ["Plunge types drop freely.", "Horsetail types stay in contact with rock.", "Cascade types descend over steps.", "Iguazu Falls spans a wide area.", "Yosemite Falls is very tall.", "They erode rock backwards over time.", "Mist often surrounds the base.", "The roar can be deafening.", "Pools form at the bottom.", "They create negative ions.", "Hydroelectric dams use their energy.", "Some freeze in winter.", "Rappelling beside them is a sport.", "Viewing platforms attract tourists.", "Spray rainbows appear.", "Some are seasonal.", "Limestone ones form tufa deposits.", "They mark changes in rock hardness.", "Some are man-made.", "It has nine letters."] },
    { word: "Popcorn", hints: ["Moisture inside the kernel creates steam.", "It pops at around 356 degrees.", "Butterfly shape is most common.", "Mushroom shape is used for coatings.", "It was eaten by Native Americans.", "Movie theaters mark up its price hugely.", "Air poppers are healthier.", "Stovetop methods use oil.", "Cheese-flavored versions are popular.", "It is naturally gluten-free.", "It has more protein than most snacks.", "One cup has about 30 calories.", "Antioxidants are found in its hulls.", "Old Maids are unpopped kernels.", "Jiffy Pop is a classic brand.", "It is light enough to throw.", "It can be strung as decoration.", "Caramel corn is a sweet treat.", "It is perfect for sharing.", "It has seven letters."] },
    { word: "Jellyfish", hints: ["Its body is 95 percent water.", "A group is called a smack.", "Some are immortal.", "Turritopsis dohrnii reverts to a polyp.", "Box ones are the most venomous.", "Some have no sting at all.", "They existed before dinosaurs.", "They have no heart.", "Nutrients diffuse through their body.", "They can clog power plant intakes.", "Bioluminescent ones glow.", "Moon jellies are common.", "Lion's mane can grow huge.", "They reproduce both sexually and asexually.", "Their sting cells are called nematocysts.", "They drift with ocean currents.", "Some species are farmed.", "They are a delicacy in some countries.", "They pulse rhythmically.", "It has nine letters."] },
    { word: "Strawberry", hints: ["It is the first fruit to ripen in spring.", "It is not technically a berry.", "Its seeds are on the outside.", "Each one has about 200 seeds.", "It is a member of the rose family.", "It runners spread new plants.", "It is used in yogurt.", "It grows in hanging baskets.", "Jam is a classic use.", "It is the most popular berry.", "It is low in calories.", "It is rich in antioxidants.", "It can cause allergies in some.", "Picking them is a popular outing.", "They bruise easily.", "Day-neutral varieties produce all summer.", "June-bearing varieties peak in early summer.", "They pair with cream.", "Wimbledon serves them.", "It has ten letters."] },
    { word: "Earthquake", hints: ["Fault lines are cracks in the crust.", "P-waves arrive first.", "S-waves follow.", "Surface waves cause the most damage.", "The Richter scale is logarithmic.", "Moment magnitude is now preferred.", "Intensity is measured by the Mercalli scale.", "Buildings can be retrofitted.", "Base isolators absorb shock.", "Tokyo is highly prepared.", "Lisbon's 1755 quake was devastating.", "Christchurch suffered major damage.", "Tectonic plates shift constantly.", "Transform faults slide sideways.", "Subduction zones push one plate under another.", "Liquefaction turns soil to liquid.", "Fires often follow them.", "Seismology studies them.", "Early warning systems save lives.", "It has ten letters."] },
    { word: "Scissors", hints: ["Leonardo da Vinci may have improved them.", "They cut with a shearing action.", "Pivot screws hold the blades.", "Tailor's shears are heavy-duty.", "Pinking shears create zigzag edges.", "Snips cut sheet metal.", "Ambidextrous ones exist.", "Spring-loaded ones open automatically.", "Embroidery ones are very small.", "Trauma shears cut through clothing.", "Hair-thinning ones have teeth.", "Titanium-coated ones stay sharp longer.", "Ergonomic handles reduce strain.", "They should be stored closed.", "Dull ones tear rather than cut.", "A first grader learns to use them.", "They symbolize cutting ties.", "Ceremonial ones cut ribbons.", "They come in many sizes.", "The word has eight letters."] },
    { word: "Harmonica", hints: ["Blues players bend notes on it.", "Diatonic ones play in one key.", "Chromatic ones have a slide.", "Tremolo ones produce a wavering sound.", "Its reeds vibrate when air passes.", "Draw notes are played by inhaling.", "Blow notes are played by exhaling.", "A rack holds it for guitar players.", "Tongue blocking is a technique.", "Overblowing extends its range.", "Cross harp is second position.", "Straight harp is first position.", "Little Walter was a master.", "Sonny Boy Williamson was legendary.", "It can mimic a train sound.", "Amplified through a microphone creates distortion.", "Special 20 is a popular model.", "Marine Band is the classic model.", "It costs very little to start.", "It has nine letters."] },
    { word: "Igloo", hints: ["Blocks are cut from compacted snow.", "Its dome distributes weight evenly.", "Warmth inside creates an ice glaze.", "Multiple rooms can connect.", "An entrance tunnel traps cold air below.", "It can be surprisingly warm.", "Caribou hides line the sleeping platform.", "An ice window lets in light.", "Building one takes about an hour for experts.", "Temperature inside stays near freezing even in extreme cold.", "The Inuit word means house.", "Wind-packed snow is best.", "It is used as temporary hunting shelters.", "Modern arctic researchers still build them.", "They insulate better than tents.", "Snow's trapped air pockets insulate.", "Sled dogs sleep outside near them.", "They are engineering marvels.", "Cultural significance is immense.", "It has five letters."] },
    { word: "Candle", hints: ["Paraffin is the most common wax.", "Soy wax burns more cleanly.", "Beeswax ones smell like honey.", "A cotton wick draws wax upward.", "The flame has different temperature zones.", "Tunneling happens when the wick is too small.", "Trimming the wick prevents smoking.", "Pillar ones are free-standing.", "Taper ones are tall and thin.", "Votive ones sit in holders.", "Tea lights are small and flat.", "Burn time varies by size.", "Scented ones freshen rooms.", "Yankee Candle is a famous brand.", "They set mood for dinners.", "Advent wreaths hold four.", "Menorahs hold nine.", "Blackouts make them essential.", "Wax pools form as they burn.", "It has six letters."] },
    { word: "Bamboo", hints: ["It is the fastest growing plant.", "Some species grow 35 inches per day.", "It is a giant grass.", "It flowers rarely, sometimes once in 120 years.", "Construction uses it for scaffolding.", "Pandas consume up to 80 pounds daily.", "It is used to make flooring.", "Bamboo fabric is soft.", "It absorbs more CO2 than trees.", "Shoots are eaten as food.", "It has over 1000 species.", "Martial arts weapons are made from it.", "It creates privacy screens.", "It has a hollow stem called a culm.", "Lucky bamboo is a popular houseplant.", "It grows on every continent except Antarctica and Europe.", "Ancient Chinese wrote on it.", "It symbolizes strength and flexibility.", "Bamboo charcoal purifies air.", "It has six letters."] },
    { word: "Castle", hints: ["Motte and bailey was an early design.", "Concentric ones had rings of walls.", "Murder holes let defenders pour hot things.", "Arrow slits protected archers.", "Great halls hosted feasts.", "Keeps were the last refuges.", "Curtain walls surrounded them.", "Portcullises were heavy iron gates.", "Barbicans defended entrances.", "Garderobe was the medieval toilet.", "Siege warfare targeted them.", "Trebuchets hurled stones at them.", "Warwick is well preserved.", "Neuschwanstein inspired Disney.", "They evolved with gunpowder.", "Star forts replaced them.", "Many are now Heritage sites.", "Ghost stories surround old ones.", "Restoration preserves them.", "It has six letters."] },
    { word: "Panda", hints: ["It has a sixth pseudo-finger.", "It spends 12 hours eating daily.", "It has a slow metabolism.", "Breeding is difficult in captivity.", "Cubs are tiny and pink at birth.", "It was removed from the endangered list.", "Habitat loss threatens it.", "China uses it in diplomacy.", "It plays and tumbles.", "Reserves protect its habitat.", "It has a distinctive black eye patch.", "Its fur is thick for mountain cold.", "Red pandas are different animals.", "It communicates with bleats and barks.", "Twins are common but only one survives.", "Conservation has increased its numbers.", "It is a national treasure of China.", "It climbs trees.", "Its scientific name means black and white cat-foot.", "It has five letters."] },
    { word: "Snowman", hints: ["Three balls of snow are traditional.", "The bottom one is the largest.", "A top hat crowns it.", "Coal buttons decorate its front.", "A corncob pipe is classic.", "Building one is a winter tradition.", "Frosty came to life with a magic hat.", "It needs packing snow.", "Arms are usually twigs.", "It faces the sun and melts.", "A photo captures it before it goes.", "Some use fruit for features.", "Competitions see who builds the tallest.", "Snow sculpting takes it further.", "It symbolizes winter joy.", "Calvin and Hobbes featured creative ones.", "Record ones are many stories tall.", "It is built in yards worldwide.", "Decorating it is half the fun.", "It has seven letters."] },
    { word: "Pirate", hints: ["They terrorized merchant ships.", "The Jolly Roger was their flag.", "Letters of marque made some legal.", "Privateers were government-sanctioned ones.", "Anne Bonny was a famous female one.", "Walking the plank may be a myth.", "Doubloons were their coins.", "Grog was their drink.", "They followed a code of conduct.", "Marooning was a punishment.", "Port Royal was their haven.", "The Golden Age was in the 1700s.", "They spread disease unintentionally.", "Modern ones exist off Somalia.", "Cutlasses were their swords.", "They used spyglasses.", "Treasure maps had X marks.", "Some traded rather than fought.", "Their stories captivate children.", "The word has six letters."] },
    { word: "Calculator", hints: ["Blaise Pascal built an early one.", "Leibniz improved the mechanical one.", "The Curta was a handheld mechanical one.", "Transistors enabled electronic ones.", "HP-35 was the first handheld scientific.", "TI-84 is popular in schools.", "RPN is reverse Polish notation.", "Solar cells power many.", "Memory recall stores past results.", "Graphing ones plot functions.", "CAS versions do algebra.", "Programmable ones run code.", "They replaced slide rules.", "Accounting depends on them.", "Engineering needs scientific ones.", "Standard ones do basic arithmetic.", "Financial ones calculate interest.", "Phone apps have replaced many.", "Keys click satisfyingly.", "It has ten letters."] },
    { word: "Submarine", hints: ["Hunley was an early combat one.", "U-boats terrorized Atlantic shipping.", "Los Angeles class are US attack types.", "Ohio class carry ballistic missiles.", "Virginia class are the newest US ones.", "Akula class are Russian.", "Double hulls provide strength.", "Trim tanks fine-tune buoyancy.", "Diving planes control angle.", "Reactor compartments are shielded.", "Mess decks serve meals.", "A galley is the kitchen.", "Officers have small staterooms.", "Enlisted share bunk rooms.", "Drills are frequent.", "Emergency blow surfaces rapidly.", "It can run silent, run deep.", "Submarine canyons share the name.", "Sandwich shops share the name.", "It has nine letters."] },
    { word: "Hurricane", hints: ["It begins as a tropical disturbance.", "Warm sea surface temperatures feed it.", "The Coriolis effect spins it.", "Outflow at the top releases energy.", "It needs sea temps above 80F.", "Dry air weakens it.", "Wind shear disrupts it.", "Concentric eye walls replace each other.", "Rapid intensification surprises forecasters.", "Storm names retire after devastating ones.", "Andrew devastated South Florida.", "Harvey flooded Houston.", "Maria destroyed Puerto Rico.", "Sandy hit the northeast US.", "Dorian stalled over the Bahamas.", "Forecast cones show possible paths.", "Hurricane hunters fly into them.", "Dropsonde instruments measure conditions.", "Preparedness kits save lives.", "It has nine letters."] },
    { word: "Waterfall", hints: ["Angel Falls drops 3212 feet.", "Niagara has three separate falls.", "Victoria Falls is called the Smoke that Thunders.", "Iguazu means great water.", "Kaieteur Falls is extremely powerful.", "They attract hikers and photographers.", "The tallest ones are in remote areas.", "Bridal Veil is a common name.", "Some are seasonal, flowing only after rain.", "Tiered ones descend in steps.", "Chute type forces through narrow gaps.", "Fan type spreads wide.", "Block type is wider than tall.", "Segmented type splits into streams.", "Frozen ones are climbed by ice climbers.", "They are measured by height and flow.", "Energy potential is enormous.", "Fish ladders bypass some.", "They are romantic landmarks.", "It has nine letters."] },
    { word: "Avalanche", hints: ["Persistent slab types are most deadly.", "Storm slabs happen during or after snowfall.", "Wind slabs form on lee slopes.", "Wet slides occur in warming temps.", "Loose snow slides are less dangerous.", "Terrain above 30 degrees is most risky.", "Convexities on slopes add stress.", "Solar radiation contributes.", "Snowpack layers have different strengths.", "Digging snow pits assesses risk.", "Rutschblock tests stress the snowpack.", "Extended column tests are standard.", "Guides assess conditions daily.", "Bulletins rate danger 1 to 5.", "One is low, five is extreme.", "Travel advice changes with rating.", "Safe travel practices reduce deaths.", "Partner rescue is fastest.", "Organized rescue takes longer.", "It has nine letters."] }
];

// Shuffle the profileWords array on startup
shuffleArray(profileWords);

function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ==================== ESTADO DO JOGO ====================
let playerIdCounter = 0;
let questions = [];

const game = {
    phase: 'lobby',
    gameMode: null,
    currentQuestion: -1,
    players: new Map(),
    hostWs: null,
    questionStartTime: null,
    questionTimer: null,
    timeLimit: 15
};

// ==================== PROFILE GAME STATE ====================
const profileGame = {
    currentWord: null,
    revealedHints: [],
    currentHintIndex: 0,
    turnOrder: [],
    currentTurnIndex: 0,
    guessedCorrectly: false,
    roundNumber: 0,
    totalRounds: 3
};

function resetProfileGame() {
    profileGame.currentWord = null;
    profileGame.revealedHints = [];
    profileGame.currentHintIndex = 0;
    profileGame.turnOrder = [];
    profileGame.currentTurnIndex = 0;
    profileGame.guessedCorrectly = false;
    profileGame.roundNumber = 0;
}

function startProfileRound() {
    profileGame.roundNumber++;
    if (profileGame.roundNumber > profileGame.totalRounds) {
        endProfileGame();
        return;
    }

    // Pick a random word
    const wordObj = profileWords[Math.floor(Math.random() * profileWords.length)];
    profileGame.currentWord = wordObj;
    profileGame.revealedHints = [];
    profileGame.currentHintIndex = 0;
    profileGame.guessedCorrectly = false;

    // Set turn order (shuffle players)
    const playerIds = Array.from(game.players.keys());
    profileGame.turnOrder = shuffleArray(playerIds);
    profileGame.currentTurnIndex = 0;

    game.phase = 'profile-playing';

    // Send word to host (host sees the word)
    sendToHost({
        type: 'profile-round-start',
        word: wordObj.word,
        totalHints: wordObj.hints.length,
        roundNumber: profileGame.roundNumber,
        totalRounds: profileGame.totalRounds,
        revealedHints: [],
        currentPlayer: getProfileCurrentPlayerInfo()
    });

    // Send to players (they don't see the word)
    broadcastToPlayers({
        type: 'profile-round-start',
        roundNumber: profileGame.roundNumber,
        totalRounds: profileGame.totalRounds,
        totalHints: wordObj.hints.length,
        revealedHints: [],
        currentPlayer: getProfileCurrentPlayerInfo()
    });

    // Tell current player it's their turn
    notifyProfileTurn();
}

function getProfileCurrentPlayerInfo() {
    const pid = profileGame.turnOrder[profileGame.currentTurnIndex];
    const player = game.players.get(pid);
    if (!player) return null;
    return { id: player.id, name: player.name };
}

function notifyProfileTurn() {
    const currentPlayerId = profileGame.turnOrder[profileGame.currentTurnIndex];
    const currentPlayer = game.players.get(currentPlayerId);
    if (!currentPlayer) {
        advanceProfileTurn();
        return;
    }

    // Tell all players whose turn it is
    game.players.forEach(p => {
        if (p.ws.readyState === 1) {
            p.ws.send(JSON.stringify({
                type: 'profile-turn',
                isYourTurn: p.id === currentPlayerId,
                currentPlayer: { id: currentPlayer.id, name: currentPlayer.name },
                revealedHints: profileGame.revealedHints,
                hintsRemaining: profileGame.currentWord.hints.length - profileGame.currentHintIndex
            }));
        }
    });

    sendToHost({
        type: 'profile-turn',
        currentPlayer: { id: currentPlayer.id, name: currentPlayer.name },
        revealedHints: profileGame.revealedHints,
        hintsRemaining: profileGame.currentWord.hints.length - profileGame.currentHintIndex
    });
}

function handleProfileRevealHint(playerId) {
    if (game.phase !== 'profile-playing') return;
    const currentPlayerId = profileGame.turnOrder[profileGame.currentTurnIndex];
    if (playerId !== currentPlayerId) return;

    if (profileGame.currentHintIndex >= profileGame.currentWord.hints.length) return;

    const hint = profileGame.currentWord.hints[profileGame.currentHintIndex];
    profileGame.currentHintIndex++;
    profileGame.revealedHints.push(hint);

    // Send revealed hint to everyone
    const hintData = {
        type: 'profile-hint-revealed',
        hint: hint,
        hintNumber: profileGame.currentHintIndex,
        totalHints: profileGame.currentWord.hints.length,
        revealedHints: profileGame.revealedHints,
        revealedBy: game.players.get(playerId)?.name || 'Unknown'
    };

    broadcastToPlayers(hintData);
    sendToHost(hintData);
}

function handleProfileGuess(playerId, guess) {
    if (game.phase !== 'profile-playing') return;
    const currentPlayerId = profileGame.turnOrder[profileGame.currentTurnIndex];
    if (playerId !== currentPlayerId) return;

    const player = game.players.get(playerId);
    if (!player) return;

    const correct = guess.trim().toLowerCase() === profileGame.currentWord.word.toLowerCase();

    if (correct) {
        profileGame.guessedCorrectly = true;
        // Points: fewer hints = more points
        const hintsUsed = profileGame.revealedHints.length;
        const points = Math.max(100, 2000 - (hintsUsed * 100));
        player.score += points;

        const resultData = {
            type: 'profile-guess-result',
            correct: true,
            guess: guess,
            word: profileGame.currentWord.word,
            playerName: player.name,
            playerId: player.id,
            pointsEarned: points,
            hintsUsed: hintsUsed,
            leaderboard: getLeaderboard(),
            roundNumber: profileGame.roundNumber,
            totalRounds: profileGame.totalRounds
        };

        broadcastToPlayers(resultData);
        sendToHost(resultData);
    } else {
        // Wrong guess
        const wrongData = {
            type: 'profile-guess-result',
            correct: false,
            guess: guess,
            playerName: player.name,
            playerId: player.id
        };

        broadcastToPlayers(wrongData);
        sendToHost(wrongData);

        // Advance to next turn
        advanceProfileTurn();
    }
}

function advanceProfileTurn() {
    profileGame.currentTurnIndex = (profileGame.currentTurnIndex + 1) % profileGame.turnOrder.length;

    // Check if all hints used
    if (profileGame.currentHintIndex >= profileGame.currentWord.hints.length) {
        // No more hints, round over with no guess
        const resultData = {
            type: 'profile-round-over',
            word: profileGame.currentWord.word,
            guessed: false,
            leaderboard: getLeaderboard(),
            roundNumber: profileGame.roundNumber,
            totalRounds: profileGame.totalRounds
        };
        broadcastToPlayers(resultData);
        sendToHost(resultData);
        return;
    }

    notifyProfileTurn();
}

function endProfileGame() {
    game.phase = 'finished';
    const leaderboard = getLeaderboard();

    game.players.forEach(p => {
        const position = leaderboard.findIndex(l => l.id === p.id) + 1;
        if (p.ws.readyState === 1) {
            p.ws.send(JSON.stringify({
                type: 'game-over',
                leaderboard: leaderboard,
                yourPosition: position,
                yourScore: p.score
            }));
        }
    });

    sendToHost({
        type: 'game-over',
        leaderboard: leaderboard
    });
}

function getPlayerList() {
    return Array.from(game.players.values()).map(p => ({
        id: p.id,
        name: p.name,
        score: p.score
    }));
}

function getLeaderboard() {
    return Array.from(game.players.values())
        .sort((a, b) => b.score - a.score)
        .map((p, i) => ({
            position: i + 1,
            id: p.id,
            name: p.name,
            score: p.score
        }));
}

function broadcastToPlayers(msg) {
    const data = JSON.stringify(msg);
    game.players.forEach(player => {
        if (player.ws.readyState === 1) {
            player.ws.send(data);
        }
    });
}

function sendToHost(msg) {
    if (game.hostWs && game.hostWs.readyState === 1) {
        game.hostWs.send(JSON.stringify(msg));
    }
}

function startQuestion() {
    game.currentQuestion++;
    if (game.currentQuestion >= questions.length) {
        endGame();
        return;
    }

    game.phase = 'question';
    game.questionStartTime = Date.now();

    game.players.forEach(p => {
        p.answered = false;
        p.currentAnswer = null;
        p.answerTime = null;
        p.currentPoints = 0;
    });

    const q = questions[game.currentQuestion];
    const questionData = {
        type: 'question',
        question: q.question,
        options: q.options,
        questionIndex: game.currentQuestion,
        totalQuestions: questions.length,
        timeLimit: game.timeLimit
    };

    broadcastToPlayers(questionData);
    sendToHost({
        ...questionData,
        answeredCount: 0,
        totalPlayers: game.players.size
    });

    game.questionTimer = setTimeout(() => {
        endQuestion();
    }, game.timeLimit * 1000 + 500);
}

function handleAnswer(playerId, answerIndex) {
    if (game.phase !== 'question') return;

    const player = game.players.get(playerId);
    if (!player || player.answered) return;

    const elapsed = (Date.now() - game.questionStartTime) / 1000;
    if (elapsed > game.timeLimit + 1) return;

    player.answered = true;
    player.currentAnswer = answerIndex;
    player.answerTime = elapsed;

    const correct = answerIndex === questions[game.currentQuestion].correct;
    if (correct) {
        const timeRatio = Math.min(elapsed / game.timeLimit, 1);
        player.currentPoints = Math.max(200, Math.round(1000 - timeRatio * 800));
    } else {
        player.currentPoints = 0;
    }

    player.ws.send(JSON.stringify({
        type: 'answer-received'
    }));

    let answeredCount = 0;
    game.players.forEach(p => { if (p.answered) answeredCount++; });

    sendToHost({
        type: 'answer-update',
        answeredCount: answeredCount,
        totalPlayers: game.players.size
    });

    if (answeredCount === game.players.size) {
        clearTimeout(game.questionTimer);
        setTimeout(() => endQuestion(), 800);
    }
}

function endQuestion() {
    if (game.phase === 'results') return;
    game.phase = 'results';

    const q = questions[game.currentQuestion];

    game.players.forEach(p => {
        if (p.answered && p.currentPoints > 0) {
            p.score += p.currentPoints;
        }
    });

    const leaderboard = getLeaderboard();

    game.players.forEach(p => {
        const correct = p.answered && p.currentAnswer === q.correct;
        const position = leaderboard.findIndex(l => l.id === p.id) + 1;

        if (p.ws.readyState === 1) {
            p.ws.send(JSON.stringify({
                type: 'question-result',
                correct: correct,
                answered: p.answered,
                correctAnswer: q.correct,
                pointsEarned: p.currentPoints || 0,
                totalScore: p.score,
                position: position,
                answerTime: p.answerTime ? p.answerTime.toFixed(1) : null
            }));
        }
    });

    const playerResults = Array.from(game.players.values()).map(p => ({
        id: p.id,
        name: p.name,
        answered: p.answered,
        correct: p.answered && p.currentAnswer === q.correct,
        answerIndex: p.currentAnswer,
        answerTime: p.answerTime ? p.answerTime.toFixed(1) : null,
        pointsEarned: p.currentPoints || 0,
        totalScore: p.score
    })).sort((a, b) => b.pointsEarned - a.pointsEarned);

    sendToHost({
        type: 'question-results',
        correctAnswer: q.correct,
        correctText: q.options[q.correct],
        playerResults: playerResults,
        leaderboard: leaderboard,
        isLastQuestion: game.currentQuestion >= questions.length - 1
    });
}

function endGame() {
    game.phase = 'finished';
    const leaderboard = getLeaderboard();

    game.players.forEach(p => {
        const position = leaderboard.findIndex(l => l.id === p.id) + 1;
        if (p.ws.readyState === 1) {
            p.ws.send(JSON.stringify({
                type: 'game-over',
                leaderboard: leaderboard,
                yourPosition: position,
                yourScore: p.score,
                gameMode: game.gameMode
            }));
        }
    });

    sendToHost({
        type: 'game-over',
        leaderboard: leaderboard,
        gameMode: game.gameMode
    });
}

function resetGame() {
    game.phase = 'lobby';
    game.gameMode = null;
    game.currentQuestion = -1;
    game.questionStartTime = null;
    questions = [];
    if (game.questionTimer) {
        clearTimeout(game.questionTimer);
        game.questionTimer = null;
    }

    game.players.forEach(p => {
        p.score = 0;
        p.answered = false;
        p.currentAnswer = null;
        p.answerTime = null;
        p.currentPoints = 0;
    });

    broadcastToPlayers({ type: 'game-reset' });
    sendToHost({ type: 'game-reset' });
    sendToHost({ type: 'lobby-update', players: getPlayerList() });
}

// ==================== HTTP SERVER ====================
const server = http.createServer((req, res) => {
    let url = req.url.split('?')[0];
    if (url === '/') url = '/index.html';

    // API to list fotos
    if (url === '/api/fotos') {
        const fotosDir = path.join(__dirname, 'public', 'fotos');
        fs.readdir(fotosDir, (err, files) => {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify([]));
                return;
            }
            const fotos = files.filter(f => /\.(jpg|jpeg|png|gif|webp|mp4)$/i.test(f)).sort();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(fotos));
        });
        return;
    }

    // API to list musicas
    if (url === '/api/musicas') {
        const musicasDir = path.join(__dirname, 'public', 'musicas');
        fs.readdir(musicasDir, (err, files) => {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify([]));
                return;
            }
            const musicas = files.filter(f => /\.mp3$/i.test(f)).sort();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(musicas));
        });
        return;
    }

    // ==================== API CAMPEONATO ====================
    const CAMP_FILE = path.join(__dirname, 'data', 'campeonato.json');

    function readCamp() {
        try { return JSON.parse(fs.readFileSync(CAMP_FILE, 'utf8')); }
        catch(e) { return null; }
    }
    function writeCamp(data) {
        fs.writeFileSync(CAMP_FILE, JSON.stringify(data, null, 2), 'utf8');
    }
    function sendJSON(res, data, code) {
        res.writeHead(code || 200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(data));
    }
    function readBody(req, cb) {
        let body = '';
        req.on('data', d => body += d);
        req.on('end', () => { try { cb(JSON.parse(body)); } catch(e) { cb({}); } });
    }

    // Função reutilizável: gera mata-mata a partir dos grupos (altera d in-place, retorna partidas criadas)
    function gerarMataMataAuto(d, categoriaId) {
        const cat = d.categorias.find(c => c.id === categoriaId);
        const regras = cat?.regras || {};
        const classificados = regras.classificacao?.classificadosPorGrupo || 2;
        const grupos = d.grupos.filter(g => g.categoriaId === categoriaId);
        if (!grupos.length) return null;
        const partidasGrupo = d.partidas.filter(p => p.categoriaId === categoriaId && p.fase === 'grupos');
        const classificacao = [];
        grupos.forEach(grupo => {
            const standings = (grupo.duplas || []).map(duplaId => {
                const pts = partidasGrupo.filter(p => p.grupoId === grupo.id && (p.dupla1Id === duplaId || p.dupla2Id === duplaId));
                let vitorias = 0, saldoSets = 0, saldoGames = 0;
                pts.forEach(p => {
                    if (p.vencedor === duplaId) vitorias++;
                    const s1 = p.placar?.dupla1 || []; const s2 = p.placar?.dupla2 || [];
                    const mine = p.dupla1Id === duplaId ? s1 : s2; const opp = p.dupla1Id === duplaId ? s2 : s1;
                    mine.forEach((g, i) => { saldoGames += g - (opp[i] || 0); if (g > (opp[i] || 0)) saldoSets++; else if (g < (opp[i] || 0)) saldoSets--; });
                });
                return { duplaId, vitorias, saldoSets, saldoGames };
            });
            standings.sort((a, b) => b.vitorias - a.vitorias || b.saldoSets - a.saldoSets || b.saldoGames - a.saldoGames);
            classificacao.push({ grupoId: grupo.id, grupoNome: grupo.nome, standings });
        });
        d.partidas = d.partidas.filter(p => !(p.categoriaId === categoriaId && p.fase !== 'grupos'));
        const evData = d.evento?.data || new Date().toISOString().slice(0,10);
        const dur = d.configuracoes?.duracaoEstimadaPartida || 40;
        const lastGroup = partidasGrupo.reduce((mx, p) => { const t = new Date(p.horario).getTime(); return t > mx ? t : mx; }, new Date(`${evData}T${d.evento?.horaInicio || '11:00'}:00`).getTime());
        let horBase = new Date(lastGroup + dur * 60000);
        const quadrasDisp = d.quadras?.length ? d.quadras.map(q => q.id) : [1];
        const topTeams = classificacao.map(g => g.standings.slice(0, classificados).map(s => s.duplaId));
        const novasPartidas = [];
        let ordem = 0;
        if (grupos.length === 2 && classificados === 2) {
            const a = topTeams[0], b = topTeams[1];
            [[a[0], b[1]], [b[0], a[1]]].forEach(([d1, d2]) => {
                novasPartidas.push({ id: Date.now() + ordem, dupla1Id: d1, dupla2Id: d2, categoriaId, grupoId: null, fase: 'semifinal', quadraId: quadrasDisp[ordem % quadrasDisp.length], horario: new Date(horBase.getTime() + Math.floor(ordem / quadrasDisp.length) * dur * 60000).toISOString(), status: 'agendado', placar: { dupla1: [], dupla2: [] }, vencedor: null, wo: false, createdAt: new Date().toISOString() });
                ordem++;
            });
            novasPartidas.push({ id: Date.now() + ordem, dupla1Id: null, dupla2Id: null, categoriaId, grupoId: null, fase: 'final', quadraId: quadrasDisp[0], horario: new Date(horBase.getTime() + 2 * dur * 60000).toISOString(), status: 'agendado', placar: { dupla1: [], dupla2: [] }, vencedor: null, wo: false, createdAt: new Date().toISOString() });
        } else {
            const allTeams = topTeams.flat();
            const fase = allTeams.length <= 4 ? 'semifinal' : allTeams.length <= 8 ? 'quartas' : 'oitavas';
            for (let i = 0; i < Math.floor(allTeams.length / 2); i++) {
                novasPartidas.push({ id: Date.now() + ordem, dupla1Id: allTeams[i], dupla2Id: allTeams[allTeams.length - 1 - i], categoriaId, grupoId: null, fase, quadraId: quadrasDisp[ordem % quadrasDisp.length], horario: new Date(horBase.getTime() + Math.floor(ordem / quadrasDisp.length) * dur * 60000).toISOString(), status: 'agendado', placar: { dupla1: [], dupla2: [] }, vencedor: null, wo: false, createdAt: new Date().toISOString() });
                ordem++;
            }
            novasPartidas.push({ id: Date.now() + ordem, dupla1Id: null, dupla2Id: null, categoriaId, grupoId: null, fase: 'final', quadraId: quadrasDisp[0], horario: new Date(horBase.getTime() + Math.ceil(allTeams.length / 2) * dur * 60000).toISOString(), status: 'agendado', placar: { dupla1: [], dupla2: [] }, vencedor: null, wo: false, createdAt: new Date().toISOString() });
        }
        d.partidas.push(...novasPartidas);
        return { classificacao, partidas: novasPartidas };
    }

    if (req.method === 'OPTIONS') {
        res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE', 'Access-Control-Allow-Headers': 'Content-Type' });
        res.end(); return;
    }

    // GET campeonato completo
    if (url === '/api/campeonato' && req.method === 'GET') {
        const d = readCamp(); sendJSON(res, d); return;
    }
    // PUT evento info
    if (url === '/api/campeonato/evento' && req.method === 'PUT') {
        readBody(req, body => { const d = readCamp(); d.evento = { ...d.evento, ...body }; writeCamp(d); sendJSON(res, d.evento); }); return;
    }
    // GET/POST atletas
    if (url === '/api/campeonato/atletas' && req.method === 'GET') {
        const d = readCamp(); sendJSON(res, d.atletas); return;
    }
    if (url === '/api/campeonato/atletas' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const atleta = { id: Date.now(), nome: body.nome || '', foto: body.foto || '', telefone: body.telefone || '', email: body.email || '', ranking: body.ranking || 0, pontos: body.pontos || 0, historico: body.historico || [], checkIn: false, seeding: body.seeding || null, favorito: body.favorito || false, createdAt: new Date().toISOString() };
            d.atletas.push(atleta); writeCamp(d); sendJSON(res, atleta, 201);
        }); return;
    }
    // PUT/DELETE atleta
    const mAtleta = url.match(/^\/api\/campeonato\/atletas\/(\d+)$/);
    if (mAtleta) {
        const aid = parseInt(mAtleta[1]);
        if (req.method === 'PUT') {
            readBody(req, body => { const d = readCamp(); const i = d.atletas.findIndex(a => a.id === aid); if (i >= 0) { d.atletas[i] = { ...d.atletas[i], ...body, id: aid }; writeCamp(d); sendJSON(res, d.atletas[i]); } else sendJSON(res, { erro: 'não encontrado' }, 404); }); return;
        }
        if (req.method === 'DELETE') {
            const d = readCamp(); d.atletas = d.atletas.filter(a => a.id !== aid); writeCamp(d); sendJSON(res, { ok: true }); return;
        }
    }
    // GET/POST duplas
    if (url === '/api/campeonato/duplas' && req.method === 'GET') {
        const d = readCamp(); sendJSON(res, d.duplas); return;
    }
    if (url === '/api/campeonato/duplas' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const dupla = { id: Date.now(), nome: body.nome || '', atleta1Id: body.atleta1Id, atleta2Id: body.atleta2Id, categoriaId: body.categoriaId, seeding: body.seeding || null, pontos: 0, historico: [], checkIn: false, createdAt: new Date().toISOString() };
            d.duplas.push(dupla); writeCamp(d); sendJSON(res, dupla, 201);
        }); return;
    }
    // PUT/DELETE dupla
    const mDupla = url.match(/^\/api\/campeonato\/duplas\/(\d+)$/);
    if (mDupla) {
        const did = parseInt(mDupla[1]);
        if (req.method === 'PUT') {
            readBody(req, body => { const d = readCamp(); const i = d.duplas.findIndex(x => x.id === did); if (i >= 0) { d.duplas[i] = { ...d.duplas[i], ...body, id: did }; writeCamp(d); sendJSON(res, d.duplas[i]); } else sendJSON(res, { erro: 'não encontrado' }, 404); }); return;
        }
        if (req.method === 'DELETE') {
            const d = readCamp(); d.duplas = d.duplas.filter(x => x.id !== did); writeCamp(d); sendJSON(res, { ok: true }); return;
        }
    }
    // GET/POST inscrições
    if (url === '/api/campeonato/inscricoes' && req.method === 'GET') {
        const d = readCamp(); sendJSON(res, d.inscricoes); return;
    }
    if (url === '/api/campeonato/inscricoes' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const cat = d.categorias.find(c => c.id === body.categoriaId);
            const jaInscritos = d.inscricoes.filter(i => i.categoriaId === body.categoriaId && i.status === 'confirmado').length;
            const status = cat && jaInscritos >= cat.maxDuplas ? 'espera' : 'confirmado';
            const insc = { id: Date.now(), duplaId: body.duplaId, categoriaId: body.categoriaId, status, createdAt: new Date().toISOString() };
            if (status === 'espera') d.listaEspera.push(insc); else d.inscricoes.push(insc);
            writeCamp(d); sendJSON(res, insc, 201);
        }); return;
    }
    // PUT inscrição (confirmar/cancelar/checkin)
    const mInsc = url.match(/^\/api\/campeonato\/inscricoes\/(\d+)$/);
    if (mInsc) {
        const iid = parseInt(mInsc[1]);
        if (req.method === 'PUT') {
            readBody(req, body => {
                const d = readCamp(); let found = d.inscricoes.find(i => i.id === iid);
                if (found) { Object.assign(found, body, { id: iid }); writeCamp(d); sendJSON(res, found); }
                else sendJSON(res, { erro: 'não encontrado' }, 404);
            }); return;
        }
        if (req.method === 'DELETE') {
            const d = readCamp(); d.inscricoes = d.inscricoes.filter(i => i.id !== iid); writeCamp(d); sendJSON(res, { ok: true }); return;
        }
    }
    // GET/POST categorias
    if (url === '/api/campeonato/categorias' && req.method === 'GET') {
        const d = readCamp(); sendJSON(res, d.categorias); return;
    }
    if (url === '/api/campeonato/categorias' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const regrasDefault = { formatoJogo: 'melhor-de-3', pontosSet: 6, tiebreak: true, pontosTiebreak: 7, superTiebreak: true, pontosSuperTiebreak: 10, noAd: false, goldenPoint: false, classificacao: { tipo: 'grupos+eliminatorias', classificadosPorGrupo: 2, criterios: ['vitorias','saldo-sets','saldo-games','confronto-direto'] } };
            const cat = { id: Date.now(), nome: body.nome, tipo: body.tipo || 'mista', maxDuplas: body.maxDuplas || 16, regras: body.regras ? { ...regrasDefault, ...body.regras } : regrasDefault };
            d.categorias.push(cat); writeCamp(d); sendJSON(res, cat, 201);
        }); return;
    }
    // PUT/DELETE categoria
    const mCat = url.match(/^\/api\/campeonato\/categorias\/(\d+)$/);
    if (mCat) {
        const cid = parseInt(mCat[1]);
        if (req.method === 'PUT') {
            readBody(req, body => { const d = readCamp(); const i = d.categorias.findIndex(c => c.id === cid); if (i >= 0) { d.categorias[i] = { ...d.categorias[i], ...body, id: cid }; writeCamp(d); sendJSON(res, d.categorias[i]); } else sendJSON(res, { erro: 'não encontrado' }, 404); }); return;
        }
        if (req.method === 'DELETE') {
            const d = readCamp(); d.categorias = d.categorias.filter(c => c.id !== cid); writeCamp(d); sendJSON(res, { ok: true }); return;
        }
    }
    // GET/POST grupos
    if (url === '/api/campeonato/grupos' && req.method === 'GET') {
        const d = readCamp(); sendJSON(res, d.grupos); return;
    }
    if (url === '/api/campeonato/grupos' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const grupo = { id: Date.now(), nome: body.nome, categoriaId: body.categoriaId, duplas: body.duplas || [], fase: body.fase || 'grupos', createdAt: new Date().toISOString() };
            d.grupos.push(grupo); writeCamp(d); sendJSON(res, grupo, 201);
        }); return;
    }
    // GET/POST partidas
    if (url === '/api/campeonato/partidas' && req.method === 'GET') {
        const d = readCamp(); sendJSON(res, d.partidas); return;
    }
    if (url === '/api/campeonato/partidas' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const partida = { id: Date.now(), dupla1Id: body.dupla1Id, dupla2Id: body.dupla2Id, categoriaId: body.categoriaId, grupoId: body.grupoId || null, fase: body.fase || 'grupos', quadraId: body.quadraId || 1, horario: body.horario || null, status: 'agendado', placar: { dupla1: [], dupla2: [] }, vencedor: null, wo: false, createdAt: new Date().toISOString() };
            d.partidas.push(partida); writeCamp(d); sendJSON(res, partida, 201);
        }); return;
    }
    // PUT partida (placar, status, WO)
    const mPartida = url.match(/^\/api\/campeonato\/partidas\/(-?\d+)$/);
    if (mPartida) {
        const pid = parseInt(mPartida[1]);
        if (req.method === 'PUT') {
            readBody(req, body => {
                const d = readCamp(); const i = d.partidas.findIndex(p => p.id === pid);
                if (i < 0) { sendJSON(res, { erro: 'não encontrado' }, 404); return; }
                const partida = { ...d.partidas[i], ...body, id: pid };
                // Atualiza quadra
                if (partida.status === 'em_jogo') { const q = d.quadras.find(q => q.id === partida.quadraId); if (q) { q.status = 'em_uso'; q.partidaAtual = pid; } }
                if (partida.status === 'encerrado' || partida.status === 'wo') { const q = d.quadras.find(q => q.id === partida.quadraId); if (q) { q.status = 'disponivel'; q.partidaAtual = null; } }
                // Avança automaticamente na chave
                if (body.vencedor && partida.fase !== 'grupos') {
                    const vDupla = body.vencedor;
                    const proxFase = partida.fase === 'oitavas' ? 'quartas' : partida.fase === 'quartas' ? 'semifinal' : partida.fase === 'semifinal' ? 'final' : null;
                    if (proxFase) {
                        const proxPartida = d.partidas.find(pp => pp.fase === proxFase && pp.categoriaId === partida.categoriaId && (pp.dupla1Id === null || pp.dupla2Id === null));
                        if (proxPartida) { if (!proxPartida.dupla1Id) proxPartida.dupla1Id = vDupla; else proxPartida.dupla2Id = vDupla; }
                    }
                }
                // Atualiza ranking
                if (body.vencedor) {
                    const vDupla = d.duplas.find(dd => dd.id === body.vencedor);
                    if (vDupla) { vDupla.pontos = (vDupla.pontos || 0) + (partida.fase === 'final' ? 100 : partida.fase === 'semifinal' ? 60 : partida.fase === 'quartas' ? 40 : partida.fase === 'grupos' ? 10 : 20); }
                }
                d.partidas[i] = partida;
                // Auto gerar mata-mata quando última partida de grupo encerrar
                let mataMataGerado = null;
                if (body.vencedor && partida.fase === 'grupos' && (partida.status === 'encerrado' || partida.status === 'wo')) {
                    const catId = partida.categoriaId;
                    const pendentes = d.partidas.filter(p => p.categoriaId === catId && p.fase === 'grupos' && p.status !== 'encerrado' && p.status !== 'wo');
                    const jaTemMM = d.partidas.some(p => p.categoriaId === catId && p.fase !== 'grupos');
                    if (pendentes.length === 0 && !jaTemMM) {
                        mataMataGerado = gerarMataMataAuto(d, catId);
                    }
                }
                writeCamp(d);
                const resposta = mataMataGerado ? { ...partida, mataMataGerado } : partida;
                sendJSON(res, resposta);
                // Broadcast WebSocket
                const wsMsg = mataMataGerado
                    ? JSON.stringify({ type: 'partida-update', partida, mataMataGerado: true })
                    : JSON.stringify({ type: 'partida-update', partida });
                wss.clients.forEach(cl => { if (cl.readyState === 1) cl.send(wsMsg); });
            }); return;
        }
        if (req.method === 'DELETE') {
            const d = readCamp(); d.partidas = d.partidas.filter(p => p.id !== pid); writeCamp(d); sendJSON(res, { ok: true }); return;
        }
    }
    // POST gerar chave automática
    if (url === '/api/campeonato/gerar-chave' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const categoriaId = body.categoriaId;
            const modo = body.modo || 'automatico'; // automatico ou manual
            const inscCat = d.inscricoes.filter(i => i.categoriaId === categoriaId && i.status === 'confirmado');
            const duplas = inscCat.map(i => d.duplas.find(dd => dd.id === i.duplaId)).filter(Boolean);
            // Seeding
            let ordenadas = duplas.sort((a, b) => (b.seeding || 0) - (a.seeding || 0));
            if (modo === 'automatico') {
                // Shuffle não-seeded
                const seeded = ordenadas.filter(d => d.seeding);
                const nao = ordenadas.filter(d => !d.seeding).sort(() => Math.random() - 0.5);
                ordenadas = [...seeded, ...nao];
            }
            // Criar grupos (mínimo 2 grupos de 4)
            const numGrupos = Math.max(2, Math.floor(ordenadas.length / 4));
            d.grupos = d.grupos.filter(g => g.categoriaId !== categoriaId);
            const grupos = [];
            for (let g = 0; g < numGrupos; g++) {
                grupos.push({ id: Date.now() + g, nome: `Grupo ${String.fromCharCode(65 + g)}`, categoriaId, duplas: [], fase: 'grupos', createdAt: new Date().toISOString() });
            }
            ordenadas.forEach((dupla, idx) => { grupos[idx % numGrupos].duplas.push(dupla.id); });
            d.grupos.push(...grupos);
            // Gerar partidas dos grupos
            d.partidas = d.partidas.filter(p => p.categoriaId !== categoriaId);
            const evData = d.evento?.data || new Date().toISOString().slice(0,10); const evHora = d.evento?.horaInicio || '11:00'; let horarioBase = new Date(`${evData}T${evHora}:00`); let ordem = 0;
            const quadrasDisp = d.quadras && d.quadras.length ? d.quadras.map(q=>q.id) : [1];
            grupos.forEach(grupo => {
                for (let i = 0; i < grupo.duplas.length; i++) {
                    for (let j = i + 1; j < grupo.duplas.length; j++) {
                        const h = new Date(horarioBase.getTime() + Math.floor(ordem / quadrasDisp.length) * (d.configuracoes?.duracaoEstimadaPartida || 40) * 60000);
                        const quadraId = quadrasDisp[ordem % quadrasDisp.length];
                        d.partidas.push({ id: Date.now() + ordem, dupla1Id: grupo.duplas[i], dupla2Id: grupo.duplas[j], categoriaId, grupoId: grupo.id, fase: 'grupos', quadraId, horario: h.toISOString(), status: 'agendado', placar: { dupla1: [], dupla2: [] }, vencedor: null, wo: false, createdAt: new Date().toISOString() });
                        ordem++;
                    }
                }
            });
            writeCamp(d); sendJSON(res, { grupos: d.grupos.filter(g => g.categoriaId === categoriaId), partidas: d.partidas.filter(p => p.categoriaId === categoriaId) });
        }); return;
    }
    // POST sorteio manual (embaralha duplas dos grupos)
    if (url === '/api/campeonato/sortear' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp(); const categoriaId = body.categoriaId;
            d.grupos.filter(g => g.categoriaId === categoriaId).forEach(g => { g.duplas = g.duplas.sort(() => Math.random() - 0.5); });
            writeCamp(d); sendJSON(res, d.grupos.filter(g => g.categoriaId === categoriaId));
        }); return;
    }
    // POST gerar mata-mata a partir da classificação dos grupos
    if (url === '/api/campeonato/gerar-mata-mata' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const categoriaId = body.categoriaId;
            const grupos = d.grupos.filter(g => g.categoriaId === categoriaId);
            if (!grupos.length) { sendJSON(res, { erro: 'Nenhum grupo encontrado' }, 400); return; }
            const partidasGrupo = d.partidas.filter(p => p.categoriaId === categoriaId && p.fase === 'grupos');
            const pendentes = partidasGrupo.filter(p => p.status !== 'encerrado' && p.status !== 'wo');
            if (pendentes.length > 0) { sendJSON(res, { erro: `Ainda há ${pendentes.length} partida(s) de grupo não finalizadas` }, 400); return; }
            const result = gerarMataMataAuto(d, categoriaId);
            if (!result) { sendJSON(res, { erro: 'Erro ao gerar mata-mata' }, 500); return; }
            writeCamp(d);
            sendJSON(res, result);
        }); return;
    }
    // GET/POST patrocinadores
    if (url === '/api/campeonato/patrocinadores' && req.method === 'GET') {
        const d = readCamp(); sendJSON(res, d.patrocinadores); return;
    }
    if (url === '/api/campeonato/patrocinadores' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const pat = { id: Date.now(), nome: body.nome, logo: body.logo || '', descricao: body.descricao || '', nivel: body.nivel || 'bronze', ativacoes: body.ativacoes || '' };
            d.patrocinadores.push(pat); writeCamp(d); sendJSON(res, pat, 201);
        }); return;
    }
    // DELETE patrocinador
    const mPat = url.match(/^\/api\/campeonato\/patrocinadores\/(\d+)$/);
    if (mPat) {
        const patid = parseInt(mPat[1]);
        if (req.method === 'DELETE') { const d = readCamp(); d.patrocinadores = d.patrocinadores.filter(p => p.id !== patid); writeCamp(d); sendJSON(res, { ok: true }); return; }
    }
    // POST importar dados completos
    if (url === '/api/campeonato/importar' && req.method === 'POST') {
        readBody(req, body => {
            if (!body.evento) { sendJSON(res, { erro: 'JSON inválido' }, 400); return; }
            writeCamp(body); sendJSON(res, { ok: true });
        }); return;
    }
    // POST resetar todos os dados
    if (url === '/api/campeonato/resetar' && req.method === 'POST') {
        const fresh = { evento: { nome: '', data: '', horaInicio: '', descricao: '', cronograma: [], local: { nome: '', endereco: '', coordenadas: { lat: '', lng: '' } }, banner: '', formato: 'grupos + eliminatórias', status: 'agendado', ativacoes: '', faq: [] }, quadras: [], categorias: [], atletas: [], duplas: [], inscricoes: [], listaEspera: [], grupos: [], partidas: [], resultados: [], ranking: [], patrocinadores: [], configuracoes: { formatoJogo: 'melhor-de-3', tipoTiebreak: 'super-tiebreak', goldenPoint: true, intervaloMinimo: 30, duracaoEstimadaPartida: 40, pontosSet: 4, pontosTiebreak: 10 }, mensagens: [], contingencia: { planosChuva: [], planosVento: [] }, circuito: { nome: '', etapas: [], rankingGeral: [] } };
        writeCamp(fresh); sendJSON(res, { ok: true }); return;
    }
    // PUT configurações
    if (url === '/api/campeonato/configuracoes' && req.method === 'PUT') {
        readBody(req, body => { const d = readCamp(); d.configuracoes = { ...d.configuracoes, ...body }; writeCamp(d); sendJSON(res, d.configuracoes); }); return;
    }
    // POST mensagem
    if (url === '/api/campeonato/mensagens' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const msg = { id: Date.now(), texto: body.texto, destinatario: body.destinatario || 'todos', createdAt: new Date().toISOString() };
            d.mensagens.push(msg); writeCamp(d);
            wss.clients.forEach(cl => { if (cl.readyState === 1) cl.send(JSON.stringify({ type: 'camp-mensagem', msg })); });
            sendJSON(res, msg, 201);
        }); return;
    }
    // POST check-in
    if (url === '/api/campeonato/checkin' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            if (body.tipo === 'dupla') { const dupla = d.duplas.find(dd => dd.id === body.id); if (dupla) dupla.checkIn = true; }
            else { const atleta = d.atletas.find(a => a.id === body.id); if (atleta) atleta.checkIn = true; }
            writeCamp(d); sendJSON(res, { ok: true });
        }); return;
    }
    // GET ranking
    if (url === '/api/campeonato/ranking' && req.method === 'GET') {
        const d = readCamp();
        const ranking = d.duplas.map(dupla => {
            const a1 = d.atletas.find(a => a.id === dupla.atleta1Id);
            const a2 = d.atletas.find(a => a.id === dupla.atleta2Id);
            const cat = d.categorias.find(c => c.id === dupla.categoriaId);
            const partidas = d.partidas.filter(p => (p.dupla1Id === dupla.id || p.dupla2Id === dupla.id) && p.status === 'encerrado');
            const vitorias = partidas.filter(p => p.vencedor === dupla.id).length;
            return { dupla, nomes: [a1?.nome, a2?.nome].filter(Boolean).join(' / '), categoria: cat?.nome, pontos: dupla.pontos || 0, partidas: partidas.length, vitorias, derrotas: partidas.length - vitorias };
        }).sort((a, b) => b.pontos - a.pontos);
        sendJSON(res, ranking); return;
    }
    // GET telão - dados em tempo real
    if (url === '/api/campeonato/telao' && req.method === 'GET') {
        const d = readCamp();
        const emJogo = d.partidas.filter(p => p.status === 'em_jogo').map(p => ({ ...p, dupla1: d.duplas.find(dd => dd.id === p.dupla1Id), dupla2: d.duplas.find(dd => dd.id === p.dupla2Id), categoria: d.categorias.find(c => c.id === p.categoriaId) }));
        const proximos = d.partidas.filter(p => p.status === 'agendado').slice(0, 5).map(p => ({ ...p, dupla1: d.duplas.find(dd => dd.id === p.dupla1Id), dupla2: d.duplas.find(dd => dd.id === p.dupla2Id), categoria: d.categorias.find(c => c.id === p.categoriaId) }));
        const encerrados = d.partidas.filter(p => p.status === 'encerrado').slice(-5).map(p => ({ ...p, dupla1: d.duplas.find(dd => dd.id === p.dupla1Id), dupla2: d.duplas.find(dd => dd.id === p.dupla2Id), categoria: d.categorias.find(c => c.id === p.categoriaId) }));
        sendJSON(res, { emJogo, proximos, encerrados, quadras: d.quadras, evento: d.evento }); return;
    }
    // PUT quadra
    const mQuadra = url.match(/^\/api\/campeonato\/quadras\/(\d+)$/);
    if (mQuadra) {
        const qid = parseInt(mQuadra[1]);
        if (req.method === 'PUT') {
            readBody(req, body => { const d = readCamp(); const i = d.quadras.findIndex(q => q.id === qid); if (i >= 0) { d.quadras[i] = { ...d.quadras[i], ...body, id: qid }; writeCamp(d); sendJSON(res, d.quadras[i]); } else sendJSON(res, { erro: 'não encontrado' }, 404); }); return;
        }
        if (req.method === 'DELETE') {
            const d = readCamp(); d.quadras = d.quadras.filter(q => q.id !== qid); writeCamp(d); sendJSON(res, { ok: true }); return;
        }
    }
    // GET/POST quadras
    if (url === '/api/campeonato/quadras' && req.method === 'GET') {
        const d = readCamp(); sendJSON(res, d.quadras); return;
    }
    if (url === '/api/campeonato/quadras' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const quadra = { id: Date.now(), nome: body.nome || 'Nova Quadra', status: 'disponivel', partidaAtual: null };
            d.quadras.push(quadra); writeCamp(d); sendJSON(res, quadra, 201);
        }); return;
    }
    // PUT contingência
    if (url === '/api/campeonato/contingencia' && req.method === 'PUT') {
        readBody(req, body => { const d = readCamp(); d.contingencia = { ...d.contingencia, ...body }; writeCamp(d); sendJSON(res, d.contingencia); }); return;
    }
    // POST verificar conflito de horário para atleta
    if (url === '/api/campeonato/verificar-conflito' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const atletaId = body.atletaId;
            const categoriaId = body.categoriaId;
            // Find all duplas this atleta is in
            const duplaIds = d.duplas.filter(dp => dp.atleta1Id === atletaId || dp.atleta2Id === atletaId).map(dp => dp.id);
            // Find all inscricoes for those duplas
            const inscCats = d.inscricoes.filter(i => duplaIds.includes(i.duplaId) && i.status === 'confirmado').map(i => i.categoriaId);
            // Find all scheduled partidas for those duplas
            const partidasAtleta = d.partidas.filter(p => duplaIds.includes(p.dupla1Id) || duplaIds.includes(p.dupla2Id));
            // Find all scheduled partidas for the new category
            const partidasNovaCat = d.partidas.filter(p => p.categoriaId === categoriaId);
            const duracao = (d.configuracoes.duracaoEstimadaPartida || 40) * 60000;
            const conflitos = [];
            for (const pA of partidasAtleta) {
                if (!pA.horario) continue;
                const tA = new Date(pA.horario).getTime();
                for (const pB of partidasNovaCat) {
                    if (!pB.horario) continue;
                    const tB = new Date(pB.horario).getTime();
                    if (Math.abs(tA - tB) < duracao) {
                        conflitos.push({ partidaExistente: pA, partidaNova: pB, diff: Math.abs(tA - tB) });
                    }
                }
            }
            sendJSON(res, { temConflito: conflitos.length > 0, conflitos, categoriasInscritas: inscCats });
        }); return;
    }
    // GET lista de espera
    if (url === '/api/campeonato/lista-espera' && req.method === 'GET') {
        const d = readCamp(); sendJSON(res, d.listaEspera || []); return;
    }
    // POST promover da lista de espera para inscrição
    if (url === '/api/campeonato/promover-espera' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const idx = d.listaEspera.findIndex(i => i.id === body.id);
            if (idx < 0) { sendJSON(res, { erro: 'não encontrado na lista de espera' }, 404); return; }
            const insc = d.listaEspera.splice(idx, 1)[0];
            insc.status = 'confirmado';
            d.inscricoes.push(insc);
            writeCamp(d); sendJSON(res, insc);
        }); return;
    }
    // GET programação (partidas organizadas por quadra)
    if (url === '/api/campeonato/programacao' && req.method === 'GET') {
        const d = readCamp();
        const porQuadra = {};
        d.quadras.forEach(q => { porQuadra[q.id] = { quadra: q, partidas: [] }; });
        d.partidas.sort((a, b) => (a.horario || '').localeCompare(b.horario || '')).forEach(p => {
            const qid = p.quadraId || d.quadras[0]?.id;
            if (!porQuadra[qid]) porQuadra[qid] = { quadra: { id: qid, nome: 'Quadra ?' }, partidas: [] };
            const d1 = d.duplas.find(dd => dd.id === p.dupla1Id);
            const d2 = d.duplas.find(dd => dd.id === p.dupla2Id);
            const cat = d.categorias.find(c => c.id === p.categoriaId);
            porQuadra[qid].partidas.push({ ...p, dupla1: d1, dupla2: d2, categoria: cat });
        });
        sendJSON(res, { porQuadra, evento: d.evento }); return;
    }
    // GET histórico de confrontos entre duplas
    if (url.startsWith('/api/campeonato/confrontos') && req.method === 'GET') {
        const params = new URL('http://x' + url.replace(/^\/api\/campeonato\/confrontos/, '')).searchParams || new URLSearchParams(url.split('?')[1] || '');
        const urlObj = new URL('http://localhost' + url);
        const d1id = parseInt(urlObj.searchParams.get('dupla1Id'));
        const d2id = parseInt(urlObj.searchParams.get('dupla2Id'));
        const d = readCamp();
        const confrontos = d.partidas.filter(p => p.status === 'encerrado' && ((p.dupla1Id === d1id && p.dupla2Id === d2id) || (p.dupla1Id === d2id && p.dupla2Id === d1id)));
        sendJSON(res, confrontos); return;
    }
    // GET estatísticas de um atleta
    const mAtletaStats = url.match(/^\/api\/campeonato\/atletas\/(\d+)\/stats$/);
    if (mAtletaStats && req.method === 'GET') {
        const aid = parseInt(mAtletaStats[1]);
        const d = readCamp();
        const atleta = d.atletas.find(a => a.id === aid);
        if (!atleta) { sendJSON(res, { erro: 'não encontrado' }, 404); return; }
        const duplas = d.duplas.filter(dp => dp.atleta1Id === aid || dp.atleta2Id === aid);
        const duplaIds = duplas.map(dp => dp.id);
        const partidas = d.partidas.filter(p => duplaIds.includes(p.dupla1Id) || duplaIds.includes(p.dupla2Id));
        const encerradas = partidas.filter(p => p.status === 'encerrado');
        const vitorias = encerradas.filter(p => duplaIds.includes(p.vencedor)).length;
        const proximas = partidas.filter(p => p.status === 'agendado').slice(0, 5);
        const categorias = [...new Set(duplas.map(dp => dp.categoriaId))].map(cid => d.categorias.find(c => c.id === cid)).filter(Boolean);
        const parceiros = duplas.map(dp => { const pid = dp.atleta1Id === aid ? dp.atleta2Id : dp.atleta1Id; return d.atletas.find(a => a.id === pid); }).filter(Boolean);
        sendJSON(res, { atleta, duplas, parceiros, categorias, totalPartidas: encerradas.length, vitorias, derrotas: encerradas.length - vitorias, proximas, historico: atleta.historico || [] }); return;
    }
    // POST chamar dupla para quadra
    if (url === '/api/campeonato/chamar-quadra' && req.method === 'POST') {
        readBody(req, body => {
            const d = readCamp();
            const partida = d.partidas.find(p => p.id === body.partidaId);
            if (!partida) { sendJSON(res, { erro: 'partida não encontrada' }, 404); return; }
            partida.status = 'chamando';
            const q = d.quadras.find(q => q.id === partida.quadraId);
            if (q) { q.status = 'chamando'; q.partidaAtual = partida.id; }
            writeCamp(d);
            const d1 = d.duplas.find(dd => dd.id === partida.dupla1Id);
            const d2 = d.duplas.find(dd => dd.id === partida.dupla2Id);
            const cat = d.categorias.find(c => c.id === partida.categoriaId);
            const chamada = { type: 'chamada-quadra', partida, dupla1: d1, dupla2: d2, categoria: cat, quadra: q };
            wss.clients.forEach(cl => { if (cl.readyState === 1) cl.send(JSON.stringify(chamada)); });
            sendJSON(res, chamada);
        }); return;
    }
    // PUT circuito (ranking geral)
    if (url === '/api/campeonato/circuito' && req.method === 'PUT') {
        readBody(req, body => { const d = readCamp(); d.circuito = { ...d.circuito, ...body }; writeCamp(d); sendJSON(res, d.circuito); }); return;
    }
    // GET circuito
    if (url === '/api/campeonato/circuito' && req.method === 'GET') {
        const d = readCamp(); sendJSON(res, d.circuito || {}); return;
    }
    // ==================== FIM API CAMPEONATO ====================

    const filePath = path.join(__dirname, 'public', decodeURIComponent(url));
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Video files need Range request support for proper playback
    if (ext === '.mp4') {
        fs.stat(filePath, (err, stat) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 - Página não encontrada</h1>');
                return;
            }
            const fileSize = stat.size;
            const range = req.headers.range;

            if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunkSize = end - start + 1;
                const stream = fs.createReadStream(filePath, { start, end });
                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': contentType,
                    'Access-Control-Allow-Origin': '*'
                });
                stream.pipe(res);
            } else {
                res.writeHead(200, {
                    'Content-Length': fileSize,
                    'Content-Type': contentType,
                    'Accept-Ranges': 'bytes',
                    'Access-Control-Allow-Origin': '*'
                });
                fs.createReadStream(filePath).pipe(res);
            }
        });
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404 - Página não encontrada</h1>');
            return;
        }
        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
    });
});

// ==================== WEBSOCKET SERVER ====================
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    let playerId = null;
    let isHost = false;

    ws.on('message', (rawData) => {
        try {
            const msg = JSON.parse(rawData.toString());

            switch (msg.type) {
                case 'host-connect':
                    isHost = true;
                    game.hostWs = ws;
                    const ip = getLocalIP();
                    ws.send(JSON.stringify({
                        type: 'connection-info',
                        ip: ip,
                        port: PORT,
                        playerUrl: `http://${ip}:${PORT}/player.html`
                    }));
                    ws.send(JSON.stringify({
                        type: 'lobby-update',
                        players: getPlayerList()
                    }));
                    break;

                case 'player-join':
                    if (game.phase !== 'lobby') {
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'O jogo já está em andamento!'
                        }));
                        return;
                    }
                    playerId = ++playerIdCounter;
                    game.players.set(playerId, {
                        id: playerId,
                        name: msg.name.substring(0, 20),
                        score: 0,
                        ws: ws,
                        answered: false,
                        currentAnswer: null,
                        answerTime: null,
                        currentPoints: 0
                    });

                    ws.send(JSON.stringify({
                        type: 'joined',
                        id: playerId,
                        name: msg.name.substring(0, 20)
                    }));

                    sendToHost({
                        type: 'lobby-update',
                        players: getPlayerList()
                    });
                    break;

                case 'select-mode':
                    if (isHost && game.phase === 'lobby') {
                        game.gameMode = msg.mode;
                        if (msg.mode === 'neural') {
                            questions = [...neuralNetQuestions];
                        } else if (msg.mode === 'familia') {
                            questions = [...familiaQuestions];
                        } else if (msg.mode === 'english') {
                            questions = shuffleArray(englishQuestions).slice(0, 10);
                        } else if (msg.mode === 'profile') {
                            // Profile mode doesn't use questions array
                            resetProfileGame();
                        } else {
                            questions = shuffleArray(randomQuestions).slice(0, 10);
                        }
                        broadcastToPlayers({ type: 'mode-selected', mode: msg.mode });
                        sendToHost({ type: 'mode-selected', mode: msg.mode });
                    }
                    break;

                case 'start-game':
                    if (isHost && game.phase === 'lobby' && game.players.size > 0 && game.gameMode) {
                        game.phase = 'starting';
                        broadcastToPlayers({ type: 'game-starting' });
                        sendToHost({ type: 'game-starting' });
                        if (game.gameMode === 'profile') {
                            setTimeout(() => startProfileRound(), 3500);
                        } else {
                            setTimeout(() => startQuestion(), 3500);
                        }
                    }
                    break;

                case 'answer':
                    if (playerId !== null) {
                        handleAnswer(playerId, msg.answerIndex);
                    }
                    break;

                case 'next-question':
                    if (isHost && game.phase === 'results') {
                        startQuestion();
                    }
                    break;

                case 'profile-reveal-hint':
                    if (playerId !== null) {
                        handleProfileRevealHint(playerId);
                    }
                    break;

                case 'profile-guess':
                    if (playerId !== null) {
                        handleProfileGuess(playerId, msg.guess || '');
                    }
                    break;

                case 'profile-next-round':
                    if (isHost && (game.phase === 'profile-playing' || game.phase === 'results')) {
                        game.phase = 'profile-playing';
                        startProfileRound();
                    }
                    break;

                case 'profile-pass':
                    if (playerId !== null) {
                        const cpid = profileGame.turnOrder[profileGame.currentTurnIndex];
                        if (playerId === cpid && game.phase === 'profile-playing') {
                            advanceProfileTurn();
                        }
                    }
                    break;

                case 'restart-game':
                    if (isHost) {
                        resetProfileGame();
                        resetGame();
                    }
                    break;
            }
        } catch (e) {
            console.error('Erro ao processar mensagem:', e);
        }
    });

    ws.on('close', () => {
        if (isHost) {
            game.hostWs = null;
        }
        if (playerId !== null && game.players.has(playerId)) {
            game.players.delete(playerId);
            sendToHost({
                type: 'lobby-update',
                players: getPlayerList()
            });

            // Se todos responderam após desconexão
            if (game.phase === 'question') {
                let answeredCount = 0;
                let totalPlayers = game.players.size;
                game.players.forEach(p => { if (p.answered) answeredCount++; });
                if (totalPlayers > 0 && answeredCount === totalPlayers) {
                    clearTimeout(game.questionTimer);
                    setTimeout(() => endQuestion(), 500);
                }
            }
        }
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err.message);
    });
});

// ==================== INICIAR SERVIDOR ====================
const localIP = getLocalIP();
server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('  ╔═══════════════════════════════════════════════╗');
    console.log('  ║           🎯  QUIZ BATTLE SERVER              ║');
    console.log('  ╠═══════════════════════════════════════════════╣');
    console.log(`  ║  Host:    http://${localIP}:${PORT}`);
    console.log(`  ║  Player:  http://${localIP}:${PORT}/player.html`);
    console.log('  ╚═══════════════════════════════════════════════╝');
    console.log('');
    console.log('  Abra o link do Host no navegador para começar!');
    console.log('');
});
