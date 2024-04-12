import flask
from flask_jsonpify import jsonpify
from flask import jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS, cross_origin

app = flask.Flask(__name__)
CORS(app)
CORS(app, support_credentials=True)

df2 = pd.read_csv('./model/tmdb.csv')
tfidf = TfidfVectorizer(stop_words='english',analyzer='word')

#Construct the required TF-IDF matrix by fitting and transforming the data
tfidf_matrix = tfidf.fit_transform(df2['soup'])

#print('shapeeee',tfidf_matrix.shape)

#construct cosine similarity matrix
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
print('cosin',cosine_sim.shape)

df2 = df2.reset_index()
indices = pd.Series(df2.index, index=df2['title']).drop_duplicates()

# create array with all movie titles
all_titles = [df2['title'][i] for i in range(len(df2['title']))]

def get_recommendations(title):
    global sim_scores
    # Get the index of the movie that matches the title
    idx = indices[title]
    # Get the pairwise similarity scores of all movies with that movie
    sim_scores = list(enumerate(cosine_sim[idx]))
    # Sort the movies based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    # Get the scores of the 6 most similar movies
    sim_scores = sim_scores[1:7]
    # print similarity scores
    print("\n movieId      score")
    for i in sim_scores:
        print(i)

    # Get the movie indices
    movie_indices = [i[0] for i in sim_scores]

    # return list of similar movies
    return_df = pd.DataFrame(columns=['Title','Homepage','ReleaseDate','Genres'])
    return_df['Title'] = df2['title'].iloc[movie_indices]
    return_df['Homepage'] = df2['homepage'].iloc[movie_indices]
    return_df['ReleaseDate'] = df2['release_date'].iloc[movie_indices]
    return_df['Genres'] = df2['genres'].iloc[movie_indices]
    return return_df

# Set up the main route
@app.route('/', methods=['GET', 'POST'])


def main():
            
    if flask.request.method == 'POST':
        data = flask.request.get_json()
        m_name = data.get('movie_name')
    
        print("movie_name:",m_name)
#        check = difflib.get_close_matches(m_name,all_titles,cutout=0.50,n=1)
        if m_name not in all_titles:
            return(jsonify([]))
        else:
            result_final = get_recommendations(m_name)
            response = []
            for i in range(len(result_final)):
                response.append({"title":result_final.iloc[i][0],"release_date":result_final.iloc[i][2],"genres":result_final.iloc[i][3] })
            return (jsonify(response))       
                

        

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8080, debug=True)
    #app.run()
