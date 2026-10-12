// 태양계 장면의 셰이더. 질감 이미지 없이 구 표면의 3차원 위치에서 바로 노이즈로 그린다(이음매가 없고, 이미지 파일·라이선스가 필요 없다).
// 별(태양)은 원점이고 빛은 늘 원점 방향에서 온다. 행성은 자기 그림자(밤)가 지고, 토성은 고리와 서로 그림자를 드리운다.

export const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float a=0.5,s=0.0;for(int i=0;i<5;i++){s+=a*snoise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=0.5;}return s;}
float fbm3(vec3 p){float a=0.5,s=0.0;for(int i=0;i<3;i++){s+=a*snoise(p);p=p*2.07+vec3(1.7,9.2,3.1);a*=0.5;}return s;}
float hash31(vec3 p){p=fract(p*0.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
`;

// 크레이터(수성·달): 셀마다 구덩이와 둘레 솟음을 만든다. 높이장이라서 화면 미분으로 요철 음영을 준다.
export const CRATERS = /* glsl */ `
float craterField(vec3 p,float scale,float seed){
  vec3 q=p*scale;
  vec3 ip=floor(q);
  vec3 fp=fract(q);
  float h=0.0;
  for(int z=-1;z<=1;z++){
    for(int y=-1;y<=1;y++){
      for(int x=-1;x<=1;x++){
        vec3 o=vec3(float(x),float(y),float(z));
        vec3 c=ip+o+seed;
        if(hash31(c+21.9)>0.58) continue;
        vec3 f=vec3(hash31(c),hash31(c+7.3),hash31(c+13.1));
        float rad=0.16+0.3*hash31(c+3.7);
        float d=length(o+f-fp);
        float bowl=smoothstep(rad,0.0,d);
        float rim=smoothstep(rad*0.5,rad,d)*smoothstep(rad*1.4,rad,d);
        h+=-bowl*0.8+rim*0.42;
      }
    }
  }
  return h;
}
`;

export const PLANET_VERT = /* glsl */ `
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vPosW;
void main(){
  vObj=position;
  vNormalW=normalize(mat3(modelMatrix)*normal);
  vec4 w=modelMatrix*vec4(position,1.0);
  vPosW=w.xyz;
  gl_Position=projectionMatrix*viewMatrix*w;
}
`;

export const PLANET_FRAG = /* glsl */ `
precision highp float;
uniform int uType;
uniform float uTime;
uniform vec3 uRingCenter;
uniform vec3 uRingNormal;
uniform vec2 uRingRange; // 안쪽·바깥쪽 반지름. x<=0이면 고리 없음
uniform float uSeed;
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vPosW;
${NOISE}
${CRATERS}

vec3 perturb(vec3 N,vec3 pos,float h,float k){
  vec3 dpdx=dFdx(pos);
  vec3 dpdy=dFdy(pos);
  float dhx=dFdx(h);
  float dhy=dFdy(h);
  vec3 r1=cross(dpdy,N);
  vec3 r2=cross(N,dpdx);
  float det=dot(dpdx,r1);
  vec3 grad=sign(det)*(dhx*r1+dhy*r2);
  return normalize(abs(det)*N-k*grad);
}

// 토성 고리의 불투명도(0~1): 위치 r(0~1)에서 C·B·A 고리와 카시니 틈
float ringDensity(float r){
  float c=smoothstep(0.0,0.06,r)*(1.0-smoothstep(0.17,0.22,r))*0.28;
  float b=smoothstep(0.2,0.26,r)*(1.0-smoothstep(0.52,0.56,r))*0.95;
  float a=smoothstep(0.62,0.65,r)*(1.0-smoothstep(0.97,1.0,r))*0.7;
  float encke=1.0-0.75*smoothstep(0.012,0.0,abs(r-0.9));
  float fine=0.78+0.22*snoise(vec3(r*140.0,1.3,uSeed));
  return clamp((c+b+a)*encke*fine,0.0,1.0);
}

vec3 bands(float lat,vec3 p,float freq,float warp,vec3 c0,vec3 c1,vec3 c2,vec3 c3){
  float w=fbm3(vec3(p.x*2.2,lat*5.0,p.z*2.2)+uSeed)*warp;
  float b=sin((lat+w)*freq)*0.5+0.5;
  float b2=sin((lat+w*1.4)*freq*2.3+1.7)*0.5+0.5;
  vec3 col=mix(c0,c1,smoothstep(0.15,0.85,b));
  col=mix(col,c2,smoothstep(0.55,0.95,b2)*0.55);
  float streak=fbm(vec3(p.x*7.0,lat*38.0,p.z*7.0)+uSeed*3.0);
  col=mix(col,c3,smoothstep(0.1,0.7,streak)*0.35);
  return col;
}

void main(){
  vec3 p=normalize(vObj);
  vec3 N=normalize(vNormalW);
  vec3 L=normalize(-vPosW);
  vec3 V=normalize(cameraPosition-vPosW);
  vec3 albedo=vec3(0.5);
  vec3 rimCol=vec3(0.0);
  float rimK=0.0;
  float spec=0.0;
  float wrap=0.0;

  if(uType==0){ // 수성
    float hh=craterField(p,5.0,uSeed)*0.6+craterField(p,12.0,uSeed+9.0)*0.35+fbm3(p*8.0+uSeed)*0.25;
    N=perturb(N,vPosW,hh,0.55);
    float tone=0.5+0.5*fbm(p*3.0+uSeed);
    albedo=mix(vec3(0.30,0.28,0.26),vec3(0.58,0.54,0.50),tone);
    albedo*=1.0+hh*0.18;
  } else if(uType==1){ // 금성
    vec3 w=p+0.45*vec3(fbm3(p*1.8+uTime*0.01),fbm3(p*1.8+4.1),fbm3(p*1.8+8.3));
    float n=fbm(w*3.2+vec3(uTime*0.012,0.0,0.0));
    albedo=mix(vec3(0.82,0.60,0.30),vec3(0.97,0.88,0.64),smoothstep(-0.4,0.6,n));
    albedo=mix(albedo,vec3(0.72,0.45,0.20),smoothstep(0.35,0.8,fbm3(p*6.0))*0.35);
    rimCol=vec3(1.0,0.82,0.5);rimK=0.7;wrap=0.25;
  } else if(uType==2){ // 지구
    float lat=abs(p.y);
    float land=fbm(p*1.7+uSeed)*0.62+fbm3(p*5.5+uSeed*2.0)*0.2;
    float sea=0.04;
    float isLand=smoothstep(sea,sea+0.025,land);
    float coast=smoothstep(sea-0.07,sea,land);
    vec3 deep=vec3(0.015,0.07,0.22);
    vec3 shallow=vec3(0.05,0.30,0.48);
    vec3 ocean=mix(deep,shallow,coast);
    float dry=smoothstep(0.1,0.55,fbm3(p*3.0+7.0)+0.45-lat*1.1);
    vec3 forest=vec3(0.07,0.24,0.08);
    vec3 desert=vec3(0.55,0.43,0.24);
    vec3 mount=vec3(0.36,0.31,0.25);
    vec3 ground=mix(forest,desert,dry);
    ground=mix(ground,mount,smoothstep(0.22,0.5,land));
    float ice=smoothstep(0.84,0.9,lat+0.06*fbm3(p*6.0));
    ground=mix(ground,vec3(0.92,0.95,1.0),ice);
    ocean=mix(ocean,vec3(0.85,0.92,1.0),smoothstep(0.88,0.95,lat));
    albedo=mix(ocean,ground,isLand);
    float cl=fbm(p*3.2+vec3(uTime*0.008,0.0,0.0)+11.0);
    float cloud=smoothstep(0.02,0.42,cl+0.08*(1.0-lat));
    albedo=mix(albedo,vec3(0.97),cloud*0.88);
    float oceanMask=(1.0-isLand)*(1.0-cloud);
    spec=pow(max(dot(reflect(-L,N),V),0.0),70.0)*0.9*oceanMask;
    rimCol=vec3(0.30,0.55,1.0);rimK=1.6;wrap=0.1;
  } else if(uType==3){ // 달
    float hh=craterField(p,4.0,uSeed)*0.5+craterField(p,10.0,uSeed+5.0)*0.4+fbm3(p*7.0)*0.2;
    N=perturb(N,vPosW,hh,0.5);
    float mare=smoothstep(0.0,0.35,fbm(p*1.6+uSeed));
    albedo=mix(vec3(0.20,0.20,0.21),vec3(0.62,0.61,0.60),mare);
    albedo*=1.0+hh*0.16;
  } else if(uType==4){ // 화성
    float n=fbm(p*2.6+uSeed);
    albedo=mix(vec3(0.62,0.30,0.15),vec3(0.80,0.47,0.27),smoothstep(-0.3,0.5,n));
    albedo=mix(albedo,vec3(0.28,0.16,0.12),smoothstep(0.25,0.65,fbm3(p*3.4+3.0))*0.75);
    float cap=smoothstep(0.9,0.95,abs(p.y)+0.04*fbm3(p*8.0));
    albedo=mix(albedo,vec3(0.95,0.93,0.92),cap);
    rimCol=vec3(1.0,0.62,0.4);rimK=0.35;
  } else if(uType==5){ // 목성
    float lat=p.y;
    albedo=bands(lat,p,15.0,0.5,vec3(0.86,0.76,0.62),vec3(0.62,0.40,0.26),vec3(0.46,0.30,0.22),vec3(0.95,0.90,0.82));
    float lon=atan(p.z,p.x);
    vec2 d=vec2((lon-1.1)*cos(-0.3)/0.30,(lat+0.30)/0.11);
    float spot=smoothstep(1.0,0.35,length(d));
    float sw=0.5+0.5*sin(atan(d.y,d.x)*2.0+length(d)*9.0-uTime*0.1);
    albedo=mix(albedo,mix(vec3(0.64,0.24,0.16),vec3(0.85,0.50,0.36),sw),spot*0.92);
    rimCol=vec3(0.95,0.8,0.6);rimK=0.25;wrap=0.3;
  } else if(uType==6){ // 토성
    float lat=p.y;
    albedo=bands(lat,p,12.0,0.35,vec3(0.90,0.80,0.58),vec3(0.76,0.63,0.43),vec3(0.84,0.72,0.50),vec3(0.96,0.9,0.72));
    albedo=mix(vec3(dot(albedo,vec3(0.33))),albedo,0.85);
    rimCol=vec3(0.95,0.85,0.6);rimK=0.2;wrap=0.3;
  } else if(uType==7){ // 천왕성
    float lat=p.y;
    albedo=bands(lat,p,7.0,0.12,vec3(0.60,0.82,0.86),vec3(0.52,0.76,0.82),vec3(0.70,0.88,0.90),vec3(0.80,0.93,0.94));
    rimCol=vec3(0.6,0.9,1.0);rimK=0.8;wrap=0.3;
  } else { // 해왕성
    float lat=p.y;
    albedo=bands(lat,p,9.0,0.3,vec3(0.14,0.28,0.72),vec3(0.20,0.38,0.82),vec3(0.10,0.20,0.58),vec3(0.55,0.72,0.95));
    float lon=atan(p.z,p.x);
    vec2 d=vec2((lon-2.2)/0.25,(lat+0.32)/0.10);
    albedo=mix(albedo,vec3(0.05,0.10,0.35),smoothstep(1.0,0.4,length(d))*0.8);
    float cirrus=smoothstep(0.55,0.8,fbm(vec3(p.x*9.0,lat*14.0,p.z*9.0)+uSeed));
    albedo=mix(albedo,vec3(0.9,0.95,1.0),cirrus*0.5);
    rimCol=vec3(0.35,0.55,1.0);rimK=0.9;wrap=0.3;
  }

  float ndl=dot(N,L);
  float lit=clamp((ndl+wrap)/(1.0+wrap),0.0,1.0);
  lit=pow(lit,0.85);
  float term=smoothstep(-0.04,0.16,dot(normalize(vNormalW),L));
  float shadow=1.0;
  if(uRingRange.x>0.0){ // 고리가 행성에 드리우는 그림자
    float denom=dot(L,uRingNormal);
    if(abs(denom)>1e-4){
      float t=dot(uRingCenter-vPosW,uRingNormal)/denom;
      if(t>0.0){
        vec3 hit=vPosW+L*t;
        float r=(length(hit-uRingCenter)-uRingRange.x)/(uRingRange.y-uRingRange.x);
        if(r>0.0&&r<1.0) shadow=1.0-0.82*ringDensity(r);
      }
    }
  }
  float fill=0.2*pow(max(dot(normalize(vNormalW),V),0.0),0.7); // 보는 쪽에서 새는 은은한 빛(밤 쪽도 형태가 보이게)
  vec3 col=albedo*(lit*1.35*term*shadow+0.014+fill)+vec3(spec)*term;
  float fres=pow(1.0-max(dot(normalize(vNormalW),V),0.0),3.0);
  col+=rimCol*fres*rimK*smoothstep(-0.3,0.4,ndl)*shadow;
  gl_FragColor=vec4(col,1.0);
}
`;

export const RING_VERT = /* glsl */ `
varying vec3 vPosW;
varying vec3 vLocal;
void main(){
  vLocal=position;
  vec4 w=modelMatrix*vec4(position,1.0);
  vPosW=w.xyz;
  gl_Position=projectionMatrix*viewMatrix*w;
}
`;

export const RING_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uCenter;
uniform float uPlanetR;
uniform vec3 uNormal;
uniform vec2 uRange;
uniform float uSeed;
varying vec3 vPosW;
varying vec3 vLocal;
${NOISE}
float ringDensity(float r){
  float c=smoothstep(0.0,0.06,r)*(1.0-smoothstep(0.17,0.22,r))*0.28;
  float b=smoothstep(0.2,0.26,r)*(1.0-smoothstep(0.52,0.56,r))*0.95;
  float a=smoothstep(0.62,0.65,r)*(1.0-smoothstep(0.97,1.0,r))*0.7;
  float encke=1.0-0.75*smoothstep(0.012,0.0,abs(r-0.9));
  float fine=0.78+0.22*snoise(vec3(r*140.0,1.3,uSeed));
  return clamp((c+b+a)*encke*fine,0.0,1.0);
}
void main(){
  float r=(length(vLocal.xy)-uRange.x)/(uRange.y-uRange.x);
  float dens=ringDensity(r);
  if(dens<0.01) discard;
  vec3 L=normalize(-vPosW);
  // 행성이 고리에 드리우는 그림자
  vec3 oc=vPosW-uCenter;
  float b=dot(oc,L);
  float c=dot(oc,oc)-uPlanetR*uPlanetR;
  float disc=b*b-c;
  float shade=1.0;
  if(disc>0.0&&b<0.0){ shade=1.0-0.93*smoothstep(0.0,uPlanetR*uPlanetR*0.12,disc); }
  vec3 tint=mix(vec3(0.62,0.54,0.42),vec3(0.92,0.84,0.68),smoothstep(0.2,0.55,r));
  tint*=0.85+0.3*snoise(vec3(r*40.0,2.2,uSeed+3.0));
  float facing=abs(dot(normalize(uNormal),L));
  float light=0.35+0.65*facing;
  vec3 col=tint*light*shade+tint*0.02;
  gl_FragColor=vec4(col,dens*(0.55+0.45*light));
}
`;

export const SUN_FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vPosW;
${NOISE}
void main(){
  vec3 p=normalize(vObj);
  vec3 N=normalize(vNormalW);
  vec3 V=normalize(cameraPosition-vPosW);
  float mu=max(dot(N,V),0.0);
  float g=fbm(p*6.0+vec3(0.0,uTime*0.05,0.0));
  float g2=fbm3(p*18.0-vec3(uTime*0.09,0.0,0.0));
  float heat=0.55+0.38*g+0.12*g2;
  float spots=smoothstep(0.55,0.75,fbm3(p*2.2+4.0))*0.35;
  heat-=spots;
  vec3 c0=vec3(0.95,0.36,0.04);
  vec3 c1=vec3(1.0,0.66,0.2);
  vec3 c2=vec3(1.0,0.93,0.66);
  vec3 col=mix(c0,c1,smoothstep(0.25,0.7,heat));
  col=mix(col,c2,smoothstep(0.7,1.0,heat));
  col*=0.5+0.5*pow(mu,0.45);
  gl_FragColor=vec4(col*1.25,1.0);
}
`;

// 후광·코로나: 색이 한가운데에서 가장자리로 부드럽게 사라지는 원. 더하기로 섞는다(알파는 건드리지 않아 별 위에 그대로 얹힌다).
export const GLOW_VERT = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv=uv;
  gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.0);
}
`;

export const GLOW_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform float uIntensity;
uniform float uFalloff;
varying vec2 vUv;
void main(){
  float d=length(vUv-0.5)*2.0;
  float a=pow(max(1.0-d,0.0),uFalloff);
  float core=smoothstep(0.55,0.0,d)*0.35;
  gl_FragColor=vec4(uColor*(a+core)*uIntensity,0.0);
}
`;
