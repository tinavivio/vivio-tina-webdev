# web-dev-template

1. git clone https://github.com/jannunzi/web-dev-template.git
1. cd web-dev-template
1. npm install
1. mongod
1. node server.js
1. browse to localhost:3000

# README
1. For problems 1-4, my implementation of graph search is the same, but I use different data strucures to keep track of the fringe. DFS uses a stack, BFS uses a queue, and UCS and A\* use a priority queue. I use a list, *explored*, to track the search states previously visited. Onto the fringe, I push tuples that contain both the search state and the full path of actions taken to get to that state. That way, once a tuple containing a goal state is popped off the fringe, the second part of the tuple can be immediately returned with no other computation.
1. For problem 5, my abstract search state is a tuple that contains both Pacman's position and a list of yet unvisited corners. Thus, my goal test returns true if and only if the list of unvisited corners has been reduced to length zero. The getSuccessors function removes a corner from the list if the successor's position is equivalent to that corner's position.
1. For problem 6, my heuristic calculates the Manhattan distance from Pacman's position to the nearest unvisited corner, then the Manhattan distance to the closest unvisited corner from that position, etc., until all corners have been reached. The heuristic returns the sum of all these distances.
1. For problem 7, my heuristic calculates the actual maze distance from Pacman's position to the furthest food source, relying on the fact that Pacman must, at bare minimum, traverse this path to reach its goal of eating all remaining food.
1. For problem 8, I run uniform cost search on the AnyFoodSearchProblem, where the goal test returns true for any position that still contains a food pellet. Using UCS ensures that Pacman will always greedily go after the closest food, since all step costs are the same.
