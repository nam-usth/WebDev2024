import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, Star, ChevronDown, ChevronUp, Home, Film, Heart, User } from 'lucide-react';

// Extended placeholder data for movies with genres
const loadMovieData = async () => {
  const movieDataContext = require.context('./movies', true, /data\.json$/);  
  const movieImageContext = require.context('./movies', true, /\.jpg$/); 

  const movies = await Promise.all(
    movieDataContext.keys().map(async (jsonKey) => {
      const folderName = jsonKey.split('/')[1]; 
      const data = await movieDataContext(jsonKey);
      const imageKey = movieImageContext.keys().find((imagePath) => imagePath.includes(folderName));
      const image = imageKey ? movieImageContext(imageKey) : null;
      const averageRating = data.ratings.reduce((sum, rating) => sum + rating, 0) / data.ratings.length;
      return {
        id: folderName,
        title: folderName.replace(/-/g, ' '),
        image,  
        ...data,
        rating: averageRating.toFixed(1),
      };
    })
  );

  return movies;
};



const TopBar = () => {
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(31, 41, 55, 0)', 'rgba(31, 41, 55, 0.9)']
  );

  const textColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.8)']
  );

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold"
            style={{ color: textColor }}
          >
            MovieMaster
          </motion.h1>
          <nav>
            <motion.ul className="flex space-x-6" style={{ color: textColor }}>
              {['Home', 'Movies', 'Favorites', 'Profile'].map((item, index) => (
                <motion.li key={item}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button className="flex items-center">
                    {index === 0 && <Home size={18} className="mr-1" />}
                    {index === 1 && <Film size={18} className="mr-1" />}
                    {index === 2 && <Heart size={18} className="mr-1" />}
                    {index === 3 && <User size={18} className="mr-1" />}
                    {item}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedFilm = () => (
  <div className="relative h-96 mb-8">
    <img 
      src="/images/featured-film.jpg" 
      alt="Featured Film" 
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="text-center text-white">
        <h2 className="text-4xl font-bold mb-2">Featured: Interstellar</h2>
        <p className="text-xl mb-4">A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.</p>
        <motion.button 
          className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Watch Trailer
        </motion.button>
      </div>
    </div>
  </div>
);

const MovieCard = ({ movie, onClick }) => (
  <motion.div
    layout
    animate={{ opacity: 1 }}
    initial={{ opacity: 0 }}
    exit={{ opacity: 0 }}
    className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
    onClick={() => onClick(movie)}
    whileHover={{ y: -5 }}
  >
    <img src={movie.image} alt={movie.title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
      <div className="flex items-center justify-between">
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{movie.genres[0]}</span>
        <div className="flex items-center">
          <Star className="text-yellow-400 mr-1" size={16} />
          <span>{movie.rating}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const MovieDetails = ({ movie, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-full overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>
      <div className="relative mb-4">
        <img
          src={`${movie.image}`}  
          alt={movie.title}
          className="object-cover rounded-lg transform scale-100 origin-center"
        />
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Genres:</h3>
        <div className="flex flex-wrap gap-2">
          {movie.genres.map((genre, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Rating:</h3>
        <div className="flex items-center">
          <Star className="text-yellow-400 mr-1" size={20} />
          <span className="text-lg font-semibold">{movie.rating}</span>
          <span className="ml-2 text-gray-600">({movie.ratings.length} ratings)</span>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Reviews:</h3>
        {movie.reviews.map((review, index) => (
          <div key={index} className="bg-gray-100 p-3 rounded-lg mb-2">
            <p>{review}</p>
          </div>
        ))}
      </div>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </motion.div>
);

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    loadMovieData().then(setMovies);
  }, []);

  const genres = ['All', ...new Set(movies.flatMap(movie => movie.genres))];

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedGenre === 'All' || movie.genres.includes(selectedGenre))
  ).sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      <FeaturedFilm />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="relative flex-grow w-full sm:w-auto mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full p-2 pl-10 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div className="flex space-x-4">
            <select
              className="p-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-full flex items-center hover:bg-blue-600 transition-colors"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              Sort
              {sortOrder === 'asc' ? <ChevronUp className="ml-1" size={20} /> : <ChevronDown className="ml-1" size={20} />}
            </button>
          </div>
        </div>
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>
        {selectedMovie && <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default App;
