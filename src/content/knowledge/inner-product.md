---
title: "Inner Product"
date: 2026-10-11
topic: ai/mathematics/analytic-geometry
status: growing
order: 2
description: "두 벡터를 실수 하나로 대응시켜 길이·각도·직교를 정의하게 하는 함수."
tags: [analytic-geometry, inner-product]
links:
  - type: knowledge
    slug: norm
    rel: prerequisite
---

같은 벡터공간의 두 벡터를 입력받아 실수를 출력하고, 쌍선형성·대칭성·양의 정부호성을 만족하는 함수이다.
기호로는 $\langle x,y\rangle $라고 쓴다.
$\mathbb{R}^n$**에서 가장 대표적인** $\text{Inner Product}$**는** $\text{Dot Product}$**이다.**
$\langle x,y\rangle =x^Ty$ 즉, $\text{Dot Product}$는 $\text{Inner Product}$의 구체적인 한 예이다.

## 왜 필요한가

두 벡터 간의 관계를 알아내기 위해 → projection이 있지 않은가?
→ **Projection의 결과:** 그림자 자체인 **벡터(Vector)  /   Inner Product의 결과:** 중복된 양을 나타내는 **실수(Scalar)**

Inner Product는 두 벡터 사이의 기하학적 관계를 하나의 실수로 나타내며, 이를 통해 벡터의 길이·각도·직교·projection 등을 정의할 수 있게 한다.

Projection과 Inner Product는 대립하는 관계가 아니라 **Inner Product가 Projection의 기반이 되는 관계**이다.

$\text{proj}_u v =\pi_u(v)= \dfrac{\langle v, u \rangle}{\Vert u\Vert ^2}  u$

이때, $\mathbb{R}^n$에서의 Inner Product, Dot Product와 그 밖의 Inner Product는 왜 다른가 궁금할 수 있다.

> **”왜** $\text{Inner Product}\neq\text{Dot Product}$**인가?”**
> → $\mathbb{R}^n$ 공간에서 우리가 익숙하게 사용하는 대표적인 표준 내적의 형태가 바로 $x^Ty$이다.
> 그런데 Linear Algebra에서 벡터는 반드시 숫자 배열일 필요가 없다.
> 예를 들어 함수, 다항식, 행렬, 수열도 Vector Space를 만들 수 있다.
>

그러면 이런 질문이 생긴다.

> “**함수 두 개의 길이**는 어떻게 측정하지”, “두 함수가 **얼마나 비슷한 방향**인지 어떻게 정의하지?” ,“두 함수가 **직교**한다는 것은 무슨 뜻이지?”
> → $\text{Dot Product}$라는 특정 공식으로는 해결할 수 없다. 그래서 수학자들은 관점을 바꾼다. “$\text{Dot Product}$의 공식 자체를 일반화 하는 것이 아니라, $\text{Dot Product}$**가 해주는 역할을 일반화하자.**”
> $\text{Dot Product}$가 해주는 핵심적인 역할은 **두 벡터를 하나의 실수로 대응시키고, 그 값을 이용하여 벡터의 크기·각도·직교 관계를 정의할 수 있게 하는 것**이다.
> 그러한 역할을 수행하는 연산을 일반화한 것이 $\text{Inner Product}$다.
>

## 배경지식

### ① Vector Space

**Vector Space = 벡터들을 모아놓고, 벡터끼리 더하거나 스칼라를 곱할 수 있도록 연산이 정의되어 있으며, 그 연산들이 정해진 규칙을 만족하는 구조**

따라서 벡터가 반드시 $\begin{bmatrix}x\\y\end{bmatrix}$처럼 생길 필요가 없다
예를 들어 함수들의 집합 $\text{V}= \{f:\mathbb{R}\rightarrow\mathbb{R}\}$을 생각해보자.

두 함수에 대해 $(f+g)(x) = f(x) +g(x)$를 정의할 수 있고,
숫자 c에 대해 $(cf)(x) = cf(x)$를 정의할 수 있다.
그리고 이 연산들이 Vector Space의 공리를 만족한다.

그러면 V자체가 Vector Space가 되고, 그 안의 각각의 함수 $f(x) =x^2$도 그 Vector Space의 Vector가 된다.

여기서 중요한 것은 : “함수가 원래 벡터였다”가 아니다. 정확히는 “**함수들을 모아 Vector Space 구조를 만들었고, 그 공간의 원소이기 때문에 그 함수를 Vector라고 부르는 것**이다.

### ② Bilinear mapping

**두 개의 벡터를 입력받으며, 한쪽 입력을 고정하면 다른 쪽 입력에 대해 선형이고, 반대로 다른 쪽을 고정해도 선형인 함수**

예를 들어 $Ω : V \times  V \to  R,\,\,$ $\Omega(x,y)$라는 연산이 있다고 하자.
첫번째 입력에 대해 $\Omega(ax+by,z)=a\Omega(x,z)+b\Omega(y,z)$이면 첫번째 인자에 대해 선형이다.
두번째 인자에 대해서도 $\Omega(x,ay+bz)=a\Omega(x,y)+b\Omega(x,z)$이면 두번째 인자에 대해 선형이다.
이를 모두 만족하면 $\Omega$는 **Bilinear mapping** 이다.

> **왜 각각 선형인가?**
> Dot Product `xᵀy`에서 y를 고정하면 x에 대한 Linear Mapping이 된다.
> 반대로 x를 고정하면 y에 대한 Linear Mapping이 된다.
> 따라서 Dot Product는 **두 인자 각각에 대해 선형이므로 Bilinear하다.**
>

### ③ 왜 Inner Product에 Bilinear가 들어가는가

**Vector Space에서는 벡터를 기저의 선형결합으로 표현할 수 있다.
Bilinearity는 이러한 선형결합 구조가 Inner Product의 계산에서도 그대로 유지되도록 한다.**
따라서 $x = \sum_{i=1}^nx_ib$ᵢ라면 $\langle x,y\rangle  = \sum_{i=1}^n x_i\langle b_i,y\rangle $로 분해할 수 있다. ($b_i$ :기저벡터)

즉, **“Bilinearity는 Inner Product가 Vector Space의 선형구조와 호환되도록 만드는 조건이다”**

#### 핵심 정리

> **Vector Space의 선형구조**
> $x = ax_1 + bx_2$
> ↓
> **Inner Product도 그 구조를 보존**
> $\langle x,y\rangle  = a\langle x_1,y\rangle  + b\langle x_2,y\rangle $
> ↓
> **Bilinearity**
> "Inner Product가 Vector Space의 선형구조와 호환된다."
>

## Inner Product의 세가지 조건

$\text{Inner Product}$는 단순히 “두 벡터를 넣어서 숫자를 뱉는 함수”가 아니다.
그 숫자가 길이·각도·직교를 정의하는 데 사용할 수 있으려면 특정 조건을 만족해야 한다.

### ① Bilinear - 선형성

$\begin{cases}\langle ax+by,z\rangle =a\langle x,z\rangle +b\langle y,z\rangle \\\langle x,ay+bz\rangle =a\langle x,y\rangle +b\langle x,z\rangle \end{cases}$     **“벡터의 선형적인 구조를 Inner Product에서도 그대로 유지하자”**

### ② Symmetric - 대칭성

$\langle x,y\rangle  = \langle y,x\rangle $   **“두 벡터 사이의 관계를 하나의 대칭적인 값으로 측정하고 싶다.”**

### ③ Positive Definite - 양의 정부호

$\langle x,x\rangle \ge 0,\langle x,x\rangle =0\iff x=0$

## 왜 필요한가?

우리는 Inner Product를 이용해 $\Vert x\Vert =\sqrt{\langle x,x\rangle }$라고 벡터의 길이를 정의한다.
⟨x,x⟩는 항상 음이 아닌 값을 가져야 하며, 특히 $x\ne 0$이면 반드시 $\langle x,x\rangle >0$이어야 한다.

만약 $x \neq0$인데 $\langle x,x\rangle =0$이라면 $\Vert x\Vert =0$이 되어버린다.
즉, 0벡터가 아닌 벡터의 길이가 0이라는 이상한 상황이 발생한다.

즉 **0벡터의 inner product만 0이 될 수 있어야 하며,** 이에 양의 정부호 조건이 필요하다.

## 직관

**Vector Space는 “벡터를 계산할 수 있는 선형적 구조”이고,
Inner Product는 그 벡터들 사이에 길이·각도·직교와 같은 기하학적 개념을 정의할 수 있게 해주는 추가적인 구조다.**

그리고 $\mathbb{R}^n$에서는 그 Inner Product가 특별히 $x^Ty$라는 익숙한 형태로 나타나는 것이다.

## 여러 Vector Space에서의 Inner Product

### ① ℝⁿ : 숫자 배열

가장 익숙한 경우다.  **x와 y가** $\mathbb{R}^n$**의 벡터라면 각 좌표를 대응시켜 곱한 뒤 모두 더한다.
Inner Product = 각 좌표의 곱의 합 = Dot Product**

$x^{\top}y$

### ② 함수공간 : 함수

함수 $f(x)$와 $g(x)$를 생각하자. 이제 우리는 함수 자체를 하나의 vector 라고 취급할 수 있다.
그렇다면 질문을 바꾼다. **“두 함수의 관계를 어떻게 하나의 숫자로 표현할 것인가?”**

⇒ $[a,b]$에서 연속인 실함수들의 공간에서의
**대표적인 함수 Inner Product 정의** : $\langle f, g\rangle  = \int_a^b f(x)g(x) dx$

#### 왜 적분인가?

$\mathbb{R}^n$에서는 $\langle x,y\rangle =x_1y_1+x_2y_2 + ... + x_ny_n$였다.
즉, **“대응되는 성분을 곱하고, 그것들을 전체적으로 더한다”** 였다.

함수에서는 각각의 x가 하나의 ‘위치’ 또는 ‘성분’처럼 생각될 수 있다.
따라서 두 함수의 관계를 살펴보려면, 각 위치 x에서 두 함수가 어떤 관계를 가지는지를 먼저 볼 수 있다. ⇒ $f(x)g(x)$
즉, 각 x에서 두 함수의 값을 곱해 그 지점에서의 관계를 하나의 값으로 만든다.

그런데 이것만으로는 함수 전체의 관계를 알 수 없다. 함수는 하나의 숫자가 아니라 여러 x에 걸쳐 존재하는 값들의 집합적인 구조이기 때문이다.
따라서 특정구간 $[a,b]$에서 각 x마다 얻은 관계를 전체적으로 합산한다.

연속적인 함수에서는 이 합산을 적분으로 표현하여 $\langle f, g\rangle  = \int_a^b f(x)g(x) dx$라고 정의할 수 있다.
즉, $\fbox{각 위치에서의 관계 f(x)g(x)} \rightarrow \fbox{전체 구간에 걸쳐 합산} \rightarrow \fbox{함수 사이의 하나의 관계 값}$의 구조이다.

#### 함수의 크기는?

**Inner Product가 주어졌다면 그 Inner Product로부터 유도되는 Norm은** $\Vert x\Vert =\sqrt{\langle x,x\rangle }$**로 정의된다**

따라서 함수의 크기는 $\Vert f\Vert =\sqrt{\int_{a}^bf(x)^2dx}$이다.

이것은 함수가 구간 전체에서 얼마나 큰 값을 갖는지를 하나의 숫자로 표현한다.
그래서 물리학·신호처리 등에서는 이를 함수의 에너지와 연결해서 해석하기도 한다.

#### 함수의 직교는?

$\langle f,g\rangle =0$이면 $\int_a^b f(x)g(x) dx=0$이므로 두 함수를 직교한다고 한다.

> **여기서 중요한 점**
> 함수의 그래프가 모든 점에서 90°라는 뜻은 아니다.
> 구간 전체에서 f(x)g(x)를 누적한 결과가 0이라는 뜻이다.
> 양의 영역과 음의 영역이 서로 상쇄될 수 있기 때문이다.
>

### ③ 다항식 공간 : 다항식

다항식은 $p(x)=a_0+a_1x+a_2x^2+...+a_nx^n$처럼 생긴 대수적 표현이다.
그리고 이 다항식에 특정 값을 넣으면 $x \rightarrow p(x)$라는 값을 만들어낼 수 있다.

따라서 다항식은 함수로 볼 수도 있지만, 선형대수에서는 다항식 자체를 하나의 대상으로도 취급할 수 있다.
(함수가 $y=sin(x), y=e^x$ 등 다항식이 아닌 경우가 많음. 다항식인 건 이례적인 경우)

#### 다항식의 inner product

##### 1. 계수벡터를 이용한 inner product

다음 두 다항식을 생각하자.

$p(x)=\sum_{k=0}^na_kx^k, g(x) =\sum_{k=0}^nb_kx^k$

이들을 계수벡터로 나타내면 $p \leftrightarrow (a_0,a_1,...,a_n), \,\, q\leftrightarrow(b_0,b_1,...,b_n)$이다.
따라서 계수벡터의 Dot product를 이용하여 $\langle p,q\rangle _{coeff} = \sum_{k=0}^na_kb_k$

ex. $\begin{cases}p(x)=1+2x+x^2\\q(x)=3-x+4x^2\end{cases} \Rightarrow \,\,\langle p,q\rangle _{coeff}=(3\cdot1)+(-1)(2)+(1\cdot4) = 5$

##### 2. 함수로 해석한 inner product

$\langle p,q\rangle _{func}=\int_a^b p(x)q(x)dx$

##### ⇒ 각 경우의 Norm과 Orthogonal

※ 계수벡터를 이용한 inner product와 함수로 해석한 inner product는 서로 다르다.
모두 다항식 공간에서 사용할 수 있지만, 일반적으로 서로 같은 값이 아니다.
또한 관점에 따라 inner product의 정의가 상이하므로 norm과 orthogonal도 관점에 따라 다르게 정의된다.

$$
\text{Norm}\begin{cases}
\|P\|_{\text{coeff}} = \sqrt{\langle p,p \rangle_{\text{coeff}}} = \sqrt{\sum_{k=0}^n a_k^2} \\
\|P\|_{\text{func}} = \sqrt{\langle p,p \rangle_{\text{func}}} = \sqrt{\int_a^b p(x)^2 dx}
\end{cases}
$$

$$
\text{Orthogonal} \begin{cases} \langle p,q\rangle _{coeff}=\sum_{k=0}^n a_kb_k=0\\\langle p,q\rangle _{func}=\int_a^bp(x)q(x)dx=0 \end{cases}
$$

### ④ 행렬 공간 : 행렬

※ 행렬의 inner product가 성립하기 위해선 두 행렬의 size가 같아야 한다.

행렬 공간에서는 행렬의 각 원소를 하나의 성분으로 볼 수 있다.

$A=\begin{bmatrix}a_{11}&a_{12}\\a_{21}&a_{22}\end{bmatrix}, B=\begin{bmatrix}b_{11}&b_{12}\\b_{21}&b_{22}\end{bmatrix}$

행렬에도 여러가지 inner product를 정의할 수 있지만, 대표적으로 $\text{Frobenius inner product}$를 사용한다.

$\langle A,B\rangle _F=\sum_{i,j} a_{ij}b_{ij}$

**즉, 대응하는 원소끼리 곱한 뒤 모두 더한다**

#### Dot Product와 같은 구조

$A=\begin{bmatrix}a&b\\c&d\end{bmatrix}$를 $(a, b, c, d)$처럼 펼쳐서 생각하면, $\text{Frobenius inner product}$는 두 행렬을 펼친 벡터들의 dot product와 같은 구조를 갖는다.

#### Norm과 Orthogonal
- $\text{Norm}=\Vert A\Vert _F=\sqrt{\langle A,A\rangle _F}=\sqrt{\sum_{i,j}(a_{ij})^2}$
- $\text{Orthogonal}=\langle A,B\rangle _F=\sum_{i,j}a_{ij}b_{ij}=0$      ※함수와 마찬가지로 물리적으로 행렬이 직각으로 놓인다는 것을 의미하는 게 아니다.

## 다양한 Vector Space에서 Inner Product를 바라보는 공통직관

**각 위치 또는 성분에서 두 Vector 사이의 관계를 계산한 뒤, 그 관계를 전체에 걸쳐 합산한다.**

**“이렇게 정의할 수 있다”와 “반드시 이렇게 정의해야한다”의 차이**

## 연습문제

MML 연습문제 3.1.
