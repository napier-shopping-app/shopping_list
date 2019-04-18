# shopping_list
A location based shopping app
If you require api key for google maps, message Ryan 

# Updates

1. Updated the master branch from local repo due to failures in loading to devices
2. Fixed issues with maps on Android
3. Removed node_modules using gitignore (FYI these may be needed to be installed locally though sidekick should it prompt)
4. Added FAB (floating action button) and add shopping list with basic functionality
5. Added addList page - passes list between addList and Home via data provider under providers/data/
6. Added login page - accessed through the menu bar and clicking on the avatar at the top
7. Login page saves a user data, this can be changed to store until logout or only while app is open
8. List functional 100% - data is retained / items able to be added.
9. Login page is now start page, unless user is logged in already then it's home
10. user details now need to be pulled from firebase instead of locally (?)
11. Facebook login still has issues with the app being in development mode

# Home

Page to display the shops and a list that relates to it

# Map

Just the maps which will show the current location and surrounding shops (user defined area and shops)

# Settings

Displays userinfo and app preferences (needs some more work)

# Login

Login is done through gmail/facebook option for Anon or to bypass completely
