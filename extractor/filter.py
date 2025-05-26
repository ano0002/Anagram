import unicodedata

def strip_accents(s):
   return ''.join(c for c in unicodedata.normalize('NFD', s)
                  if unicodedata.category(c) != 'Mn')
   
min_length = 4

with open("words_alpha.txt", "r",encoding= "utf-8") as file:
    english_words = set(file.read().splitlines())


# Filter words based on length and non alphabetic characters
filtered_words = list(filter(lambda word: len(word) >= min_length and word.isalpha(), english_words))

# Remove accents from the words
filtered_words = map(strip_accents, filtered_words)

# Remove duplicates by converting to a set and back to a list
filtered_words = list(set(filtered_words))

print("Starting list length:", len(english_words))
print("After filtering length:", len(filtered_words))

with open("filtered_words.txt", "w", encoding="utf-8") as file:
    file.write("\n".join(filtered_words))
        
print("Filtered words written to filtered_words.txt")