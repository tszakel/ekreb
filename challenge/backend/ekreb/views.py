from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from rest_framework.views import APIView
import requests
import random

class ResetStats(APIView):
    def post(self, request):
        # Reset the score and accuracy to 0
        Stats.objects.update(score=0, accuracy=0)
        return Response(status=status.HTTP_200_OK)


class RetrieveStats(APIView):
    def get(self, request):
        stats = Stats.objects.all()
        if stats:
            serializer = StatsSerializer(stats, many=True)
            return JsonResponse(serializer.data, safe=False)
        else:
            return JsonResponse({"error": "No stats available"}, status=404)

class UpdateStats(APIView):
    def post(self, request):
        serializer = StatsSerializer(data=request.data)
        if serializer.is_valid():
            score = serializer.validated_data.get("score")
            accuracy = serializer.validated_data.get("accuracy")
            print("score: %s accuracy: %s" % (score, accuracy))

            if Stats.objects.exists():
                print('I EXIST')
                stats = Stats.objects.first()
                print("score: %s acurracy: %s" % (score, accuracy))
                stats.score += score
                stats.accuracy += accuracy
                stats.save()
            else:
                print('I DO NOT EXIST')
                Stats.objects.create(score=score, accuracy=accuracy)

            return JsonResponse({"score": score, "accuracy": accuracy})
        else:
            return JsonResponse({"error": "Serializer validation failed or no POST made to stats yet"}, status=400)



def shuffle(word):
    # Convert the word to a list of characters
    word_list = list(word)

    # Fisher-Yates Shuffle Algorithm
    for i in range(len(word_list) - 1, 0, -1):
        j = random.randint(0, i)
        word_list[i], word_list[j] = word_list[j], word_list[i]  # Swap characters

    # Join the shuffled list back into a string
    shuffled_word = ''.join(word_list)
    return shuffled_word

class RetrieveWords(APIView):
    def get(self, request):
        words = Word.objects.all()
        if words:
            selected_word = random.choice(words)
            # Delete the selected word from the database
            selected_word.delete()
            # Scramble the selected word
            scrambled_word = shuffle(selected_word.word)
            return JsonResponse({
                "unscrambledWord": selected_word.word,
                "scrambledWord": scrambled_word
            })
        else:
            return JsonResponse({"error": "No words available"}, status=404)

class PopulateWords(APIView):
    def __init__(self):
        super().__init__()
        self.words_list = []

    def get_unique_word(self):
        # Fetch a word from the API
        url = "https://wordsapiv1.p.rapidapi.com/words/"
        querystring = {"random":"true", "lettersMin":"4", "lettersMax":"8"}

        headers = {
            "X-RapidAPI-Key": "dc9bf3d1femsh7fee2e3ad336a71p17c1c6jsnb938165c7a17",
            "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)

        if response.status_code == 200:
            data = response.json()
            serializer = WordSerializer(data=data)  # Pass the data to the serializer

            if serializer.is_valid():
                word = serializer.validated_data.get("word")
                print(word)
            else:
                return JsonResponse({'error': 'Serializer validation failed'}, status=400)

            # Check if the word is unique
            if word not in self.words_list:
                self.words_list.append(word)
                Word.objects.create(word=word) # Save the word to the database
                return word
        else:
            return JsonResponse({'error': 'Failed to fetch a word from the external API'}, status=500)

    def get(self, request):
        #Keep fetching words until you have at least 3 unique words
        # Check if there are already 3 words in the database
        if Word.objects.count() >= 3:
            print("enough words are already in the database")
            # If there are 3 or more words, return a response indicating that no more words need to be added
            return Response({"message": "There are already 3 or more words in the database."}, status=status.HTTP_200_OK)

        while len(self.words_list) < 3:
            self.get_unique_word()

        return JsonResponse({"words": self.words_list})