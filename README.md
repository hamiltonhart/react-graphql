
# Django-React-GraphQL-Heroku


The purpose of this repo is to provide boilerplate code for developing a Django backend with a React frontend using GraphQL. It also assumes deployment to Heroku and using PostgresQL as the final database.

The notes that follow to do detail the entire code but rather detail the essentials to get a good starting point. I used the sources below for the bulk of the information.

## Sources

### [Original Article](https://dev.to/shakib609/deploy-your-django-react-js-app-to-heroku-2bck)

### [Agatha Codes - Painless PostgresQL Django](https://medium.com/agatha-codes/painless-postgresql-django-d4f03364989)

### [Agatha Codes - 9 Straightforward Steps for Deploying Django to Heroku](https://medium.com/agatha-codes/9-straightforward-steps-for-deploying-your-django-app-with-heroku-82b952652fb4)

### [Django For Beginners](https://djangoforbeginners.com)

---

## __Generating React App__
```bash
$ yarn create react-app app-name
```
The above command will create a directory named app-name and it should have the below structure.
```
appname
├── node_modules
├── public
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
│   ├── react-app-env.d.ts
│   └── serviceWorker.ts
├── package.json
└── yarn.lock
```


### __Install other React packages:__
```bash
  $ yarn add graphql apollo-boost @apollo/react-hooks react-apollo react-dom react-router-dom
```
## __Create Python Virtualenv__

Move into the app-name directory created above. And, using pipenv, create and activate a new virtualenv.

```
  $ cd app-name
  $ pipenv shell
```

As stated, this will create and activate the virtualenv. Be sure the virtualenv is active when doing the following pip/pipenv installs.

### __Install Django and Backend Dependencies__

```bash
  $ pipenv install django graphene-django django-graphql-jwt django-cors-headers whitenoise gunicorn dj-database-url django-heroku
```
_You might face problems while installing django-heroku if you don't have postgresql installed._

_If there are problems even with postgresql installed, run the following command then try installing django-heroku again._

```
$ env LDFLAGS="-I/usr/local/opt/openssl/include -L/usr/local/opt/openssl/lib" pip install psycopg2
```

## __Create Django App__
Now it's time to create our django app. Activate your virtualenv if it is not already.

```bash
  $ pipenv shell
```

I am naming my backend project backend. While inside the _app-name_ directory, run the below command to generate the project inside the current directory:

```bash
  $ django-admin startproject backend
```

After generating the django project our project structure will look something similar to this.
```
├── backend
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
├── package.json
├── Procfile
├── public
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── README.md
├── src
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
│   ├── react-app-env.d.ts
│   └── serviceWorker.ts
└── yarn.lock
```

## __Update Settings__

### __React__
First change that we will do is add a proxy key to our _**package.json**_. This will proxy all our API requests in development. You can learn more about it [here](https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development). Add the following line to the end of your _**package.json**_ file, just before the final bracket.

```javascript
{
  ...
  "proxy": "http://localhost:8000"
}
```


After that, we have to create a directory named _**static**_ inside the public directory. We will move the contents of the public directory into this new _**static**_ directory **except** the _**index.html**_ file. After moving the public directory should look like this.

```
public
├── index.html
└── static
    ├── favicon.ico
    └── manifest.json
```

We have to move these files, so that when we build our React app by executing `yarn build ` we will get these files inside a build/static directory, which we will use as our Django projects `STATIC_ROOT`.

Now, according our directory structure we have to refactor the _**public/index.html**_ file. Open _**public/index.html**_ file and update the _**favicon.ico**_ and _**manifest.json**_ urls to `/static/favicon.ico` and `/static/manifest.json`.

### **Django**

We mainly have one HTML file to serve(the React app generated HTML file). Let's create a view in our django app to serve this HTML file. I'll use Generic TemplateView to create the view. Create a _**views.py**_ file inside the _**backend**_ directory and add the below python code to the file:

```python
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache

# Serve Single Page Application

index = never_cache(TemplateView.as_view(template_name='index.html'))
```

One thing to notice here that, I am using the `never_cache` decorator while initializing the index view. This decorator is pretty straight-forward. This adds headers to a response so that it will never be cached. We will be generating our _**index.html**_ file from our React app which might change any time. That's why we do not want any browser to cache obsolete _**index.html**_ file.

We've written the index view. Now let's add it to the _**urls.py**_. We will serve the _**index.html**_ from our root url. Now open your _**urls.py**_ and update it according to the code below:

```python
from django.contrib import admin
from django.urls import path

from .views import index

urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
]
```

Most of our work is done.

All now we have to do is update our _**backend/settings.py**_ file. Here, we'll first do everything as instructed in django-heroku documentation. After applying these changes, our app won't work straightaway. We have to update our _**settings.py**_ file further to make it work. 

First, add whitenoise, corsheaders and graphene_django to your INSTALLED_APPS like below. You have to list whitenoise right before django.contrib.staticfiles. And we also have to add the whitenoise middleware right after Djangos SecurityMiddleware. corsheaders middleware should be at the top of the list.

``` python
INSTALLED_APPS= [
    ...
    'whitenoise.runserver_nostatic',  # < As per whitenoise documentation
    'django.contrib.staticfiles',

    # 3rd party apps
    'corsheaders',
    'graphene_django',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddelware', # Corsheaders Middleware
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Whitenoise Middleware
    ...
]
```

Amend ALLOWED_HOSTS with the following, replacing yoururl.com with the url of your Heroku app.

```python
ALLOWED_HOSTS = ['0.0.0.0', 'localhost', 'yoururl.com']
```

### **Set Environment Variables**

Sensitive information should be saved as environment variables to ensure important information is not available to the public.

Create a file, _**.env**_, and add it to your _**.gitignore**_ file. 

In this boilerplate, the below variables cover the `SECRET_KEY` and Database authentication.

[Django Secret Key Generator](https://www.miniwebtool.com/django-secret-key-generator/)

```bash
DJANGO_SECRET_KEY=’your secret key’
DB_NAME=’database name’
DB_USER=’database user’
DB_PASS=’database password’
```

Add the following code below the current `DATABASES` dictionary and comment it out. It is commented out for ease of development. For production or to use PostgresQL during development, uncomment the below and comment out the sqlite3 database the exists by default.

```python
import dj_database_url     #Add to the top of settings.py


db_from_env = dj_database_url.config()
    DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('DB_NAME', ''),
        'USER': os.environ.get('DB_USER', ''),
        'PASSWORD': os.environ.get('DB_PASS', ''),
        'HOST': 'localhost',
        'PORT': '5432',
        }
    }
DATABASES['default'].update(db_from_env)
```

Now, we have to update our `TEMPLATES` settings, so that our django app can find the _**index.html**_ we referred to in our _**backend/views.py**_ file. You can add additional directories you want to include here too.

```python
TEMPLATES = [
    {
        'BACKEND':
        'django.template.backends.django.DjangoTemplates',
        'DIRS':
        [os.path.join(BASE_DIR, 'build')]
        ...
    }
]
```

Almost ready! We have to update our ``STATIC`` file related settings and move them to the bottom of the backend/settings.py file. Update your _**settings.py**_ file like below:

```python

import django_heroku  # Add to the top of the file.

# Configure app for Heroku deployment
django_heroku.settings(locals())

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/
STATIC_URL = '/static/'
# Place static in the same location as webpack build files
STATIC_ROOT = os.path.join(BASE_DIR, 'build', 'static')
STATICFILES_DIRS = []

# If you want to serve user uploaded files add these settings
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'build', 'media')

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

## **Testing Our Setup**
We are now ready to test our app. A few things we have to keep in mind in this setup:

* ALWAYS run yarn build after you've updated your front-end 
* While developing, you have to run the react server and django server separately to make use of the built-in hot-reload of these servers. 

Now, run the below commands to test whether our app is serving the files correctly. It's best to have two CLI windows to run the front and backend development servers.

```bash
  $ yarn build
  $ pipenv shell
  $ python manage.py runserver
```

Open your preferred browser and navigate to `localhost:8000`. You should see the default React app.

## **Preparing for Heroku Deployment**

First, let's create our heroku app with the below command(Make sure you have heroku-cli installed):

```bash
  $ heroku create heroku-app-name
```

Add nodejs and python buildpacks and the postgresql addon to our app.

```bash
  $ heroku buildpacks:add --index 1 heroku/nodejs
  $ heroku buildpacks:add --index 2 heroku/python
  $ heroku addons:create heroku-postgresql:hobby-dev
```

Create a Procfile just inside the app-name folder with the following text:

```
release: python manage.py migrate
web: gunicorn backend.wsgi --log-file -
```

Here, the release option makes sure to run your django migrations after each deploy. And the web option serves your django application using gunicorn HTTP server.

You have to generate a requirements.txt file for heroku deployments. So, don't forget to do that.

```bash
$ pipenv lock -r > requirements.txt
```

We are ready to push the first version of our app. Create a git repository and make a commit. After that, push the files to heroku by running the below command:

```bash
  $ git push heroku master
```

