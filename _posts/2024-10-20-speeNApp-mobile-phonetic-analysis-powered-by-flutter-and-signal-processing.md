---
layout: post
title: "SpeeNApp: Mobile Phonetic Analysis Powered by Flutter and Signal Processing"
tags: flutter app news
image: /img/portfolio/speenap_logo.jpeg
typewriter-delay: 20
---

In today’s era of mobile-first technology, access to advanced tools has expanded across various domains. However, phonetic analysis, a critical aspect of linguistic and acoustic research, has remained largely desktop-bound, relying on powerful tools such as Praat and ELAN. These applications, while highly capable, lack mobile accessibility, limiting their use in dynamic environments. Enter **SpeeNApp**, a mobile solution designed to bridge this gap, providing users with comprehensive phonetic analysis capabilities directly on their smartphones.

## Problem Overview

Phonetic analysis plays a crucial role in fields ranging from linguistics and forensic phonetics to speech therapy. Tools like Praat have become the gold standard for these tasks, offering detailed spectrogram analysis, pitch tracking, and transcription through TextGrid files. However, these applications require desktop platforms, limiting portability and real-time analysis capabilities.

SpeeNApp addresses these challenges by bringing a full suite of phonetic tools to mobile devices, making it easier for researchers, educators, and enthusiasts to analyze speech on the go. The goal of SpeeNApp is to replicate the core functionalities of Praat while offering a modern, intuitive interface optimized for mobile use.

## System Architecture and Frameworks

SpeeNApp was developed using **Flutter**, a popular cross-platform framework, which ensures seamless deployment on both Android and iOS. Flutter’s widget-based architecture allows for a high level of customization, essential for designing complex user interfaces such as spectrogram displays and transcription editors. The choice of **Dart** as the programming language, with its support for just-in-time (JIT) and ahead-of-time (AOT) compilation, enabled efficient development and smooth user experience.

Key design patterns, such as the **BLoC (Business Logic Component)** pattern, were employed to maintain a clean separation between the user interface and business logic. This modular approach not only improves scalability but also ensures that the app is easy to maintain and extend in future iterations.

![SpeeNApp Overview]({{ site.baseurl }}/img/posts/speenap_overview.jpeg){:.center-block}

## Core Functionalities

1. **Audio Recording in WAV Format**  
   SpeeNApp supports high-quality audio recording in WAV format, enabling users to capture vocal samples for immediate analysis. This feature is essential for linguists and speech therapists working in the field, who may need to analyze audio data in real-time.

2. **Spectrogram Analysis**  
   The app generates detailed **spectrograms**, which visually represent the frequency spectrum of audio signals over time. This feature uses the **Fast Fourier Transform (FFT)** algorithm, specifically its optimized version, to ensure fast and accurate rendering of audio frequencies. Users can adjust parameters such as view range (in Hz), dynamic range (in dB), and windowing functions to customize the analysis.

3. **Pitch Detection**  
   SpeeNApp implements a pitch analysis algorithm inspired by Paul Boersma’s work. By analyzing the **fundamental frequency (F0)** of audio signals, users can track variations in pitch, which is crucial for studying intonation and tone in spoken language.

4. **TextGrid Creation and Analysis**  
   A key feature of Praat, TextGrid files allow for the detailed annotation of audio signals, such as marking syllables, pauses, or speech segments. SpeeNApp not only supports the reading of TextGrid files but also allows users to create new annotations, making it a powerful tool for field researchers.

5. **Real-time Interaction**  
   The user interface is designed for real-time interaction, allowing users to zoom in on specific segments of the audio signal, scroll horizontally through time, and adjust the spectrogram's frequency axis. This dynamic approach is crucial for detailed phonetic analysis, where precision is paramount.

## Third-party Libraries

To bring advanced signal processing to mobile devices, several third-party libraries were integrated into the system:

- **FFTEA (Fast Fourier Transform)** for efficient spectrogram generation.
- **BLoC** for state management, ensuring a clean separation between the user interface and the application logic.
- **Isar**, a high-performance NoSQL database, is used to store user data locally, enabling offline access and ensuring that data retrieval is fast and efficient.
- **Freezed**, a library that simplifies the creation of immutable data classes, helps manage application state in a reliable and maintainable way.

## Challenges and Solutions

One of the most significant challenges faced during the development of SpeeNApp was optimizing the rendering of spectrograms on mobile hardware. Initially, each frequency bin was rendered individually, leading to performance bottlenecks. To solve this, **instanced rendering** was implemented, which dramatically improved the performance, allowing for smooth scrolling and zooming even on large audio files.

Another challenge was replicating the accuracy of Praat’s pitch detection algorithm in a mobile environment. By adapting Boersma’s autocorrelation method and optimizing it for real-time analysis, SpeeNApp successfully provides precise pitch tracking without compromising on performance.

![SpeeNApp challenges and solutions]({{ site.baseurl }}/img/posts/speenap_1.jpeg){:.center-block}

## Future Enhancements

SpeeNApp is designed with future expansion in mind. Some planned features include:

- **Microservices for Enhanced Functionality**: Implementing cloud-based microservices for tasks such as automatic transcription or forced alignment will allow SpeeNApp to handle even more complex analysis tasks without burdening the mobile device.
- **Intensity and Formant Analysis**: Future updates will introduce tools to measure the intensity and formant frequencies of speech signals, further expanding SpeeNApp’s analytical capabilities.
- **Editing Transcriptions**: Users will soon be able to edit transcriptions directly within the app, a feature that will prove invaluable for creating detailed annotations on the go.

## Conclusion

SpeeNApp is a significant step forward in the world of mobile phonetic analysis. By combining the power of tools like Praat with the accessibility of mobile platforms, it opens new possibilities for linguists, researchers, and educators who need to perform phonetic analysis anytime, anywhere. With a focus on intuitive design, robust functionality, and future scalability, SpeeNApp is poised to become a go-to tool for mobile phonetic research.
